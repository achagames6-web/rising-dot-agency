# Content Management Guide

## Hybrid Static/Dynamic Architecture

This website uses a **hybrid content delivery system** that combines the best of both static and dynamic approaches:

- **Static Content** (Pages): Ultra-fast JSON files served directly from CDN
- **Dynamic Content** (Blogs): Real-time MongoDB queries for immediate updates

## Architecture Overview

### Static Content Flow

```
MongoDB (Source of Truth)
    ↓
[Generate Script] npm run generate:content
    ↓
Static JSON Files (/public/content/*.json)
    ↓
Next.js Build (CDN Distribution)
    ↓
Lightning-Fast Page Loads
```

### Dynamic Content Flow

```
MongoDB (Blogs Collection)
    ↓
Server-Side API Routes
    ↓
Real-Time Blog Updates
```

## Performance Improvements

### Before (MongoDB API-based)

- Homepage: ~2.5s (10+ API calls)
- Service pages: ~3s (15+ API calls)
- Each API call: 50-150ms + 100ms overhead
- High server load

### After (Hybrid Approach)

- Homepage: ~300ms (**8x faster**)
- Service pages: ~400ms (**7x faster**)
- Blog pages: Normal speed (still dynamic)
- Minimal server load
- Better SEO and user experience

## Managing Content

### Editing Static Content (Pages)

1. **Access Content Manager**
   - Navigate to `/admin/content` in the admin dashboard
   - You'll see a grid of all content sections

2. **Edit Content**
   - Click "Edit" on any section
   - Modify the JSON content in the editor
   - Use the Preview mode to review changes
   - Validate JSON before saving

3. **Save Changes**
   - Click "Save & Regenerate"
   - This updates MongoDB and regenerates static files automatically
   - Changes are live immediately after regeneration

4. **Tips**
   - Images should be in the media folder shown for each section
   - Reference images as `/media/[page]/[filename].jpg`
   - Ensure valid JSON syntax (strings need quotes)
   - The editor shows real-time validation

### Managing Blogs (Dynamic)

Blogs remain **fully dynamic** and don't require regeneration:

1. Navigate to `/admin/blogs`
2. Create, edit, or delete blog posts
3. Changes are live immediately
4. No static file regeneration needed

## File Structure

### Static Content Files

```
/public/content/
├── home.json                 # Homepage content
├── about.json                # About page content
├── portfolio.json            # Portfolio page content
├── services-webdesign.json   # Web Design service page
├── services-seo.json         # SEO service page
├── services-wordpress.json   # WordPress service page
├── services-shopify.json     # Shopify service page
├── services-chatbot.json     # Chatbot service page
├── services-n8n.json         # N8N service page
├── services-saas.json        # SaaS service page
├── contact.json              # Contact page content
└── _manifest.json            # Generation metadata
```

### Media Files

```
/public/media/
├── home/          # Homepage images
├── about/         # About page images
├── portfolio/     # Portfolio images
├── services/      # All service pages images
├── contact/       # Contact page images
└── blog/          # Blog post images
```

## Content Regeneration

### Automatic (During Build)

- Static content is automatically generated during `npm run build`
- Ensures production always has the latest content

### Manual (Admin Dashboard)

- Click "Regenerate All" button in Content Manager
- Regenerates all static JSON files from MongoDB
- Use after bulk updates or database migrations

### Programmatic (Script)

```bash
npm run generate:content
```

## Deployment Workflow

### 1. Local Development

```bash
# Start development server
npm run dev

# Edit content via admin panel or MongoDB
# Changes reflected immediately in dev mode
```

### 2. Content Updates

```bash
# Option A: Use Admin Dashboard (Recommended)
# 1. Edit content at /admin/content
# 2. Click "Save & Regenerate"

# Option B: Manual Script
npm run generate:content
```

### 3. Build & Deploy

```bash
# Generate static content + build
npm run build

# Start production server
npm run start
```

### 4. Deployment to Production

```bash
# Push changes to Git
git add .
git commit -m "Update content"
git push

# Deployment platform (Vercel/Netlify) will:
# 1. Run npm run build (includes content generation)
# 2. Deploy to CDN
# 3. Content is live!
```

## Technical Details

### Content Hook (`useSiteContent`)

The hook now fetches from static JSON files:

```typescript
// Before
const res = await fetch(`/api/content?page=${page}&section=${section}`);

// After
const res = await fetch(`/content/${page}.json`);
```

### Benefits

- **No database queries** for page content
- **CDN edge caching** for global speed
- **Reduced server costs** (fewer API calls)
- **Better reliability** (static files never timeout)

### Cache Strategy

- Client-side cache: 10 seconds
- CDN cache: Configurable per deployment
- Stale content served instantly while revalidating

## API Routes

### Admin APIs

- `GET /api/admin/content/static` - List all static content
- `POST /api/admin/content/update` - Update content in MongoDB
- `POST /api/admin/content/regenerate` - Regenerate static files

### Public APIs

- `GET /content/{page}.json` - Fetch static page content (direct file)
- `GET /api/blogs` - Fetch blogs (dynamic, unchanged)
- `GET /api/content` - Legacy API (still available for backwards compatibility)

## Troubleshooting

### Content not updating on live site?

1. Check if static files are regenerated: Look at `/public/content/_manifest.json`
2. Clear CDN cache if deployed
3. Run `npm run generate:content` manually
4. Check deployment logs for build errors

### JSON validation errors?

- Use a JSON validator (like jsonlint.com)
- Check for missing quotes around strings
- Ensure proper comma placement
- Use the Content Manager's built-in validator

### Images not loading?

- Verify image path matches media folder structure
- Check file exists in `/public/media/[page]/`
- Use absolute paths starting with `/media/`
- Ensure file extensions are correct

### Performance still slow?

- Check Network tab in browser DevTools
- Verify static files are being served (not API calls)
- Look for large images (optimize them)
- Check for unused/duplicate API calls

## Best Practices

1. **Content Changes**
   - Always use Content Manager for editing
   - Test changes locally before deploying
   - Keep JSON formatting consistent

2. **Images**
   - Optimize images before uploading (WebP recommended)
   - Use descriptive filenames
   - Keep images under 500KB when possible
   - Store in appropriate media folders

3. **Deployment**
   - Always run `npm run build` locally first
   - Review changes in preview/staging
   - Monitor deployment logs
   - Test key pages after deployment

4. **Backup**
   - MongoDB is the source of truth
   - Regular database backups recommended
   - Version control for code changes
   - Document custom content structures

## Future Enhancements

Planned improvements:

- Cloudinary migration for media hosting
- Automatic image optimization
- Content versioning and rollback
- Multi-language support
- A/B testing capabilities
- Real-time preview without regeneration

## Support

For questions or issues:

1. Check this documentation
2. Review deployment logs
3. Test in local development environment
4. Check browser console for errors
5. Verify MongoDB connection

---

**Last Updated**: December 2024
**Version**: 1.0.0
