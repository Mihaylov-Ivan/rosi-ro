# Migration to Supabase Storage Only

## Changes Made

✅ **Updated SQL Schema** - Removed default portfolio projects with local image paths
✅ **Updated Frontend** - Removed fallback to local placeholder images
✅ **Updated Next.js Config** - Added Supabase Storage domain to allowed image sources
✅ **Upload Route** - Already configured to use Supabase Storage

## What This Means

### Before

- Images could be stored locally in `public/` folder
- Database had local paths like `/modern-apartment-building.png`
- Fallback to `/placeholder.svg` if image missing

### After

- **All images must be in Supabase Storage** (except logo.png)
- Database stores Supabase Storage URLs only
- No fallback to local images
- Logo remains at `/images/logo.png` (static asset)

## Setup Required

1. **Create Supabase Storage Bucket**

   - Go to Supabase Dashboard → Storage
   - Create bucket: `portfolio-images`
   - Make it **Public**

2. **Upload Existing Images** (if you have any)

   - Upload your portfolio images to the `portfolio-images` bucket
   - Note the public URLs
   - Update database records with those URLs

3. **Add Projects via Admin Panel**
   - All new projects will automatically use Supabase Storage
   - Upload images through the admin panel

## Image URL Format

All portfolio images will have URLs like:

```
https://[project-ref].supabase.co/storage/v1/object/public/portfolio-images/portfolio/[filename].jpg
```

## Exception: Logo

The logo at `/images/logo.png` remains as a local static asset and will continue to work.

## Next Steps

1. Run the updated SQL schema (it won't insert default projects)
2. Create your Supabase Storage bucket
3. Upload images via admin panel or manually to Supabase Storage
4. Create portfolio projects via admin panel
