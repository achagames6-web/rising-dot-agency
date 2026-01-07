# Social Media Icons

## Purpose
Social media platform icons for footer, contact sections, and social sharing.

## Icon Requirements
- **Dimensions:** 24x24px to 48x48px (or SVG)
- **Format:** SVG (strongly preferred) or PNG
- **Background:** Transparent
- **Max Size:** 10KB per icon
- **Style:** Consistent across all platforms

## Supported Platforms
Common social media icons:
- Facebook
- Twitter (X)
- LinkedIn
- Instagram
- YouTube
- GitHub
- Email
- WhatsApp
- Telegram
- Discord

## Naming Convention
- `facebook.svg`
- `twitter.svg`
- `linkedin.svg`
- `instagram.svg`
- `youtube.svg`
- `github.svg`
- `email.svg`

## How to Use

### Current Implementation
Icons are currently handled by **React Icons** library:
- Import from `react-icons/fa` (Font Awesome)
- Or from `lucide-react`

Example:
```tsx
import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
```

### If Using Custom Icons
1. Upload SVG to this folder
2. Import in component:
```tsx
import FacebookIcon from '@/public/icons/social/facebook.svg';
```

## Icon Sources

### Free Icon Sets:
- **Lucide React:** https://lucide.dev/ (built-in)
- **React Icons:** https://react-icons.github.io/react-icons/ (built-in)
- **Simple Icons:** https://simpleicons.org/
- **Ionicons:** https://ionic.io/ionicons

### Official Brand Icons:
- **Facebook:** https://about.facebook.com/brand/
- **Twitter:** https://about.twitter.com/en/company/brand-resources
- **LinkedIn:** https://brand.linkedin.com/
- **Instagram:** https://about.instagram.com/brand

## Style Options

### 1. Monochrome (Recommended)
- Single color (white or brand color)
- Changes on hover
- Consistent with site design
- Better for dark/light themes

### 2. Brand Colors
- Official platform colors
- More recognizable
- Stands out visually
- Less flexible

### 3. Outlined
- Minimalist style
- Modern appearance
- Works on any background
- Less visual weight

## Usage Locations
Social icons appear in:
- Footer (CTA section)
- Contact page
- Blog post sharing
- Team member profiles
- About page

## Implementation Example

### Footer Social Links:
```tsx
const socialLinks = [
  {
    name: 'Facebook',
    href: 'https://facebook.com/risingdot',
    icon: FaFacebook,
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/risingdot',
    icon: FaTwitter,
  },
  // ... more platforms
];
```

## Accessibility

### Requirements:
- Add `aria-label` to links
- Use semantic HTML
- Provide text alternatives
- Ensure keyboard navigation

Example:
```tsx
<a 
  href="https://twitter.com/risingdot"
  aria-label="Follow us on Twitter"
  className="social-link"
>
  <FaTwitter />
</a>
```

## Styling Tips

### Hover Effects:
```css
.social-icon {
  transition: all 0.3s ease;
  color: #ffffff;
}

.social-icon:hover {
  color: #37AFE1; /* Brand color */
  transform: translateY(-2px);
}
```

### Size Variants:
- **Small:** 20px (inline, footer)
- **Medium:** 24px (standard)
- **Large:** 32-48px (prominent CTAs)

## Brand Guidelines

### ⚠️ Platform Requirements:
Some platforms have strict brand guidelines:
- Use official colors (or monochrome)
- Maintain proper spacing
- Don't modify logos
- Follow platform terms of service

### Safe Practices:
- Link to official profiles only
- Don't impersonate
- Keep profiles active
- Monitor for broken links

## Performance

### Optimization:
- Use SVG for scalability
- Icon fonts for multiple icons
- Lazy load if many icons
- Consider icon sprite sheets

### Current Setup:
Site uses React Icons library (bundled, tree-shakeable) - no custom icons needed unless special requirements.

## Maintenance Checklist
- [ ] Verify all links work
- [ ] Update when platforms rebrand
- [ ] Check for deprecated platforms
- [ ] Add new platforms as needed
- [ ] Test on mobile devices
- [ ] Ensure accessibility compliance
