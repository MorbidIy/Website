# Morbidly Mods — Modernized Website

A modern, responsive website for Morbidly Mods featuring a black & red minimalist aesthetic. Built with vanilla HTML, CSS, and JavaScript — no frameworks, no build steps.

## 🎯 Features

- **Modern Landing Page** — Hero section, featured cards, latest updates, stats counter
- **Wiki-Style Documentation** — Fixed sidebar navigation, card-based content grid
- **Responsive Design** — Mobile-first, works on all screen sizes (320px+)
- **Dark Theme** — Black background with red accent (#ff0000)
- **View Transitions** — Smooth page navigation animations
- **Search** — Client-side search with keyboard navigation
- **Accessibility** — Semantic HTML, ARIA labels, focus management, WCAG AA
- **Zero Dependencies** — Vanilla JS, no frameworks required

## 📁 Project Structure

```
E:\Projects\Claude\
├── index.html              # Landing page + wiki home
├── styles.css              # Complete design system + components
├── scripts/
│   └── main.js             # All interactions (sidebar, search, transitions, etc.)
├── pages/
│   ├── getting-started.html    # Bully SE installation guide
│   ├── releases.html           # Mod downloads with category filters
│   ├── gta-services.html       # GTA V account services showcase
│   ├── contact.html            # Contact form + channels
│   └── tos.html                # Terms of Service
├── assets/
│   └── images/
│       ├── morbidlytitle.png   # Logo (SVG placeholder)
│       ├── morbidlymods.png    # Banner (SVG placeholder)
│       ├── morbiddunce.png     # Footer logo (SVG placeholder)
│       ├── left-bg.png         # Background patterns
│       ├── right-bg.png
│       ├── tiled-bg.png
│       ├── cover-bg.png
│       ├── card-*.jpg          # Card thumbnails
│       ├── update-*.jpg        # Update thumbnails
│       └── gta-showcase-*.jpg  # GTA showcase images
└── .gitignore
```

## 🎨 Design System

### Colors
```css
--color-bg: #000000;           /* Pure black background */
--color-accent: #ff0000;       /* Primary red */
--color-accent-hover: #cc0000; /* Red hover */
--color-fg: #ffffff;           /* White text */
--color-fg-muted: #999999;     /* Muted gray */
--color-fg-subtle: #666666;    /* Subtle gray */
--color-border: #ff0000;       /* Red borders */
--color-border-subtle: #333333;/* Subtle borders */
```

### Typography
- **Display**: Space Grotesk (headings, logos)
- **UI**: Space Grotesk (body, buttons, navigation)
- **Mono**: JetBrains Mono (code, versions, technical text)

### Spacing Scale
Based on 4px unit: `--space-1` (4px) through `--space-20` (80px)

### Border Radius
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 16px
- `--radius-2xl`: 24px

## 🚀 Getting Started

### Local Development

Simply open `index.html` in a browser. No server required for basic viewing.

For search and view transitions to work properly, serve via HTTP:

```bash
# Python 3
python -m http.server 8000

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8000
```

Then visit `http://localhost:8000`

### Adding Your Assets

Replace the placeholder SVG images in `assets/images/` with your actual assets:

| Placeholder | Recommended Size | Format |
|-------------|------------------|--------|
| `morbidlytitle.png` | 400×120px | PNG/SVG |
| `morbidlymods.png` | 800×400px | PNG/JPG |
| `morbiddunce.png` | 120×120px | PNG/SVG |
| `card-*.jpg` | 400×225px (16:9) | JPG/WebP |
| `gta-showcase-*.jpg` | 400×225px (16:9) | JPG/WebP |
| Background patterns | 400×1080px | PNG/SVG |

## 🔧 Customization

### Colors
Edit CSS custom properties in `styles.css`:

```css
:root {
  --color-accent: #ff0000;      /* Change primary red */
  --color-accent-hover: #cc0000; /* Change hover red */
  --color-bg: #000000;          /* Change background */
}
```

### Typography
Change font imports in `index.html` and update `--font-display`, `--font-ui`, `--font-mono` in `styles.css`.

### Content
- Edit HTML files directly for text content
- Add new pages in `pages/` following the existing structure
- Update navigation in all HTML files (header nav + sidebar)

## 📱 Responsive Breakpoints

| Breakpoint | Target |
|------------|--------|
| 1200px | Tablet landscape / small desktop |
| 900px | Tablet portrait (sidebar becomes drawer) |
| 480px | Mobile phones |

## ♿ Accessibility

- Semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `<article>`, `<section>`)
- ARIA labels on interactive elements
- Focus visible styles
- Keyboard navigation (Tab, Arrow keys, Escape)
- Reduced motion support (`prefers-reduced-motion`)
- Color contrast meets WCAG AA
- Screen reader compatible

## ⚡ Performance

- No external dependencies (fonts loaded via Google Fonts with `preconnect`)
- CSS custom properties for efficient theming
- IntersectionObserver for scroll animations
- Passive event listeners for scroll
- Lazy loading ready (`loading="lazy"` on images)
- Minimal JS (~15KB)

## 🌐 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 14+
- Edge 80+

View Transitions API requires Chrome 111+ / Edge 111+ (gracefully falls back)

## 📄 License

Personal project — not affiliated with Rockstar Games, Take-Two Interactive, or any official entities.

Mods credited to original authors where applicable:
- CombineSlayer24 (Kick Me Sign)
- seigimonogatari (Pitbull Bodyguards)
- tupakka1 (Smoking Regen HP)

## 🤝 Contributing

This is a personal portfolio project. For bug reports or suggestions, open an issue on GitHub.

---

**Built with** vanilla HTML, CSS, and JavaScript — no frameworks, no build steps, no bloat.