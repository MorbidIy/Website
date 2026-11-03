/**
 * Vercel Serverless Function - Fetch Instagram Follower Count
 *
 * Setup:
 * 1. Convert Instagram to Business/Creator account
 * 2. Go to https://developers.facebook.com/ → Create App → Consumer
 * 3. Add "Instagram Graph API" product
 * 4. Get User Access Token with permissions: instagram_basic, instagram_manage_insights
 * 5. Exchange for Long-lived token (60 days) using:
 *    GET https://graph.facebook.com/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}
 * 6. Get Instagram Business Account ID:
 *    GET https://graph.facebook.com/me/accounts?access_token={long-lived-token}
 * 7. Add these as Vercel Environment Variables:
 *    - INSTAGRAM_ACCESS_TOKEN (your long-lived token)
 *    - INSTAGRAM_BUSINESS_ACCOUNT_ID (your Instagram Business Account ID)
 */

export default async function handler(req, res) {
  // Enable CORS for your domain
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  if (!accessToken || !businessAccountId) {
    console.error('Missing Instagram credentials in environment variables');
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Instagram credentials not configured'
    });
  }

  try {
    // Fetch follower count from Instagram Graph API
    const url = `https://graph.facebook.com/v19.0/${businessAccountId}?fields=followers_count&access_token=${accessToken}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.error) {
      console.error('Instagram API error:', data.error);

      // Handle token expiration
      if (data.error.code === 190 || data.error.code === 463) {
        return res.status(401).json({
          error: 'Token expired',
          message: 'Instagram access token has expired. Please regenerate it.'
        });
      }

      return res.status(500).json({
        error: 'Instagram API error',
        message: data.error.message
      });
    }

    // Return the follower count
    return res.status(200).json({
      followers_count: data.followers_count,
      username: data.username || 'morbidly',
      updated_at: new Date().toISOString()
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: 'Failed to fetch Instagram data'
    });
  }
}