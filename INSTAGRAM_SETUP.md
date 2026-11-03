# Instagram Followers Setup Guide

This guide explains how to connect your Instagram follower count to the website's "Community Members" stat.

## Prerequisites

1. **Instagram Business/Creator Account** - Personal accounts cannot use the Graph API
2. **Meta Developer Account** - [developers.facebook.com](https://developers.facebook.com)

---

## Step 1: Convert to Business/Creator Account

1. Open Instagram app → Settings → Account type and tools
2. Switch to **Professional Account** → Choose **Business** (or Creator)
3. Complete setup (connect to Facebook Page if prompted)

---

## Step 2: Create Meta Developer App

1. Go to [developers.facebook.com](https://developers.facebook.com/)
2. Click **Create App** → **Consumer** → Next
3. App Name: `Morbidly Mods Instagram` (or your choice)
4. App Contact Email: your email
5. Click **Create App**

---

## Step 3: Add Instagram Graph API

1. In your app dashboard, click **Add Product**
2. Find **Instagram Graph API** → Click **Set Up**
3. This adds Instagram to your app

---

## Step 4: Get Access Token

### Option A: Quick Test Token (expires in 1 hour)

1. In app dashboard → **Instagram Graph API** → **Tools**
2. Click **Generate Token** under "User Token"
3. Grant permissions: `instagram_basic`, `instagram_manage_insights`
4. Copy the **short-lived token** (valid 1 hour)

### Option B: Long-lived Token (valid 60 days) — **REQUIRED FOR PRODUCTION**

1. Get short-lived token (Step 4A)
2. Exchange for long-lived token:
   ```
   GET https://graph.facebook.com/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={YOUR_APP_ID}&
     client_secret={YOUR_APP_SECRET}&
     fb_exchange_token={SHORT_LIVED_TOKEN}
   ```
3. Copy the returned `access_token` (valid 60 days)
4. **Important**: Set up token refresh before 60 days expire

---

## Step 5: Get Instagram Business Account ID

1. Use the long-lived token to find your account:
   ```
   GET https://graph.facebook.com/v19.0/me/accounts?
     access_token={LONG_LIVED_TOKEN}
   ```
2. In the response, find your Instagram business account
3. Copy the `id` field (looks like `17841400008460056`)

---

## Step 6: Configure Vercel Environment Variables

1. Push this project to GitHub
2. Import repository in [Vercel Dashboard](https://vercel.com/dashboard)
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

| Name | Value |
|------|-------|
| `INSTAGRAM_ACCESS_TOKEN` | Your long-lived access token from Step 4B |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Your Instagram Business Account ID from Step 5 |

5. Redeploy (Vercel auto-redeploys on env var changes)

---

## Step 7: Test Locally (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.local

# Start dev server
vercel dev
```

Visit `http://localhost:3000/api/instagram-followers` to test the API.

---

## Token Refresh (Automation)

Long-lived tokens expire after 60 days. To auto-refresh:

### Option 1: Cron Job (GitHub Actions / Vercel Cron)

Create `.github/workflows/refresh-token.yml`:
```yaml
name: Refresh Instagram Token
on:
  schedule:
    - cron: '0 0 */30 * *'  # Every 30 days
  workflow_dispatch:

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Refresh token
        run: |
          NEW_TOKEN=$(curl -s "https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id=${{ secrets.APP_ID }}&client_secret=${{ secrets.APP_SECRET }}&fb_exchange_token=${{ secrets.INSTAGRAM_ACCESS_TOKEN }}" | jq -r .access_token)
          echo "INSTAGRAM_ACCESS_TOKEN=$NEW_TOKEN" >> $GITHUB_ENV
      - name: Update Vercel env
        uses: actions/github-script@v7
        with:
          script: |
            // Use Vercel API to update env var
            // Requires VERCEL_TOKEN secret
```

### Option 2: Manual Refresh (Every ~50 days)

1. Generate new short-lived token in Meta Developer Console
2. Exchange for long-lived token (Step 4B)
3. Update `INSTAGRAM_ACCESS_TOKEN` in Vercel Environment Variables
4. Vercel auto-redeploys

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `{"error":{"code":190}}` | Token expired - regenerate long-lived token |
| `{"error":{"code":463}}` | Token expired - same as above |
| `{"error":{"code":100}}` | Invalid Business Account ID - verify Step 5 |
| CORS error | Check `vercel.json` headers are configured |
| "Server configuration error" | Env vars not set in Vercel dashboard |

---

## Security Notes

- **Never commit tokens to Git** - use Vercel Environment Variables only
- Use **separate tokens** for dev/prod if needed
- Monitor **Instagram API rate limits** (200 calls/hour/user)
- The API caches responses for ~5 minutes to reduce calls

---

## Files Created

- `api/instagram-followers.js` - Vercel serverless function
- `vercel.json` - Vercel configuration
- `scripts/main.js` - Updated with fetch logic
- This guide: `INSTAGRAM_SETUP.md`

---

## Quick Test After Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app/api/instagram-followers`
2. Should return JSON like:
   ```json
   {
     "followers_count": 1234,
     "username": "morbidly",
     "updated_at": "2026-11-03T..."
   }
   ```
3. Visit your site - the "Community Members" stat should animate to your real follower count