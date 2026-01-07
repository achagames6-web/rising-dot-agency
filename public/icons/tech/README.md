# Technology Stack Icons

## Purpose
Logo icons for technology stack marquee and technology showcases across the site.

## Icon Requirements
- **Dimensions:** 120x120px (square) or SVG (vector)
- **Format:** SVG (preferred) or PNG
- **Background:** Transparent
- **Max Size:** 50KB per icon
- **Style:** Official brand logos or consistent icon set

## Current Technologies
Common tech stack icons needed:
- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, MongoDB, PostgreSQL
- **Cloud:** Vercel, AWS, Google Cloud
- **Tools:** GitHub, VS Code, Figma
- **AI/ML:** OpenAI, TensorFlow, Python
- **Other:** Docker, Kubernetes, etc.

## Naming Convention
Use lowercase with hyphens:
- `react.svg`
- `nextjs.svg`
- `typescript.svg`
- `tailwind-css.svg`
- `mongodb.svg`

## How to Add Tech Icons

1. **Find official logo:**
   - Visit technology's official brand page
   - Download SVG version (preferred)
   - Or use high-quality PNG

2. **Prepare icon:**
   - Ensure transparent background
   - Resize to 120x120px (if PNG)
   - Optimize file size
   - Keep original colors

3. **Upload to this folder**

4. **Update tech stack component:**
   - Open `components/sections/TechStackMarquee.tsx`
   - Add icon to the array (around line 15-85):
   ```tsx
   {
     src: '/icons/tech/your-tech.svg',
     alt: 'Your Tech Logo',
     name: 'Your Tech'
   }
   ```

5. **Commit and deploy**

## Icon Sources

### Official Brand Resources:
- **React:** https://react.dev/
- **Next.js:** https://nextjs.org/
- **Vercel:** https://vercel.com/design
- **MongoDB:** https://www.mongodb.com/brand-resources
- **GitHub:** https://github.com/logos

### Icon Collections:
- **Simple Icons:** https://simpleicons.org/ (SVG tech logos)
- **DevIcon:** https://devicon.dev/ (Developer icons)
- **Super Tiny Icons:** https://github.com/edent/SuperTinyIcons

## Style Guidelines

### ✅ Good Icons:
- Official brand colors
- Clean, recognizable
- Transparent background
- Square or circular
- Scalable (vector preferred)
- Properly centered

### ❌ Avoid:
- Low resolution
- Wrong brand colors
- White/colored backgrounds
- Distorted aspect ratio
- Unofficial/modified logos
- Trademarked content without permission

## SVG Optimization

### Before uploading SVG:
1. Remove unnecessary code
2. Minify with tools like SVGO
3. Set viewBox properly
4. Remove fill colors if needed (for dynamic coloring)

### Example optimized SVG:
```svg
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <path d="..." fill="currentColor"/>
</svg>
```

## Usage Locations
These icons appear in:
- Tech stack marquee (homepage)
- Service pages (tech used)
- About page (capabilities)
- Footer (partners/tools)

## Brand Compliance

### ⚠️ Important:
- Use official logos only
- Follow brand guidelines
- Don't modify logos
- Check trademark policies
- Provide attribution if required
- Remove if requested by brand owner

## Responsive Considerations
Icons should:
- Scale properly at all sizes
- Remain clear when small
- Work on dark backgrounds
- Work on light backgrounds
- Handle retina displays

## Accessibility
- Use descriptive alt text
- Consider adding text labels
- Ensure sufficient contrast
- Support screen readers

## Maintenance
- Update logos when brands redesign
- Remove outdated technologies
- Add new tools as adopted
- Keep collection organized
- Regular audit for quality
