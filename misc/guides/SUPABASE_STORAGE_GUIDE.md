# Supabase Storage Guide for Images

## Current Setup (Local Storage)

Currently, images are stored locally in the `public/uploads/` directory on your server. This works for development but has limitations:

- ❌ Files are lost when you redeploy
- ❌ Not scalable for production
- ❌ No CDN benefits
- ❌ Storage tied to your server

## Supabase Storage (Recommended)

Supabase Storage is like AWS S3 - it's a cloud-based file storage service that:

- ✅ Persists files across deployments
- ✅ Scales automatically
- ✅ Provides CDN for fast image delivery
- ✅ Includes built-in image transformations
- ✅ Free tier: 1GB storage, 2GB bandwidth/month

## How It Works

1. **Storage Bucket**: A container for your files (like a folder)
2. **File Path**: The path within the bucket (e.g., `portfolio/image-123.jpg`)
3. **Public URL**: Supabase generates a public URL you can use in your app

## Setup Steps

### 1. Create Storage Bucket in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click **New bucket**
4. Name it `portfolio-images` (or any name you prefer)
5. Make it **Public** (so images can be accessed without authentication)
6. Click **Create bucket**

### 2. Set Up Storage Policies

In Supabase SQL Editor, run:

```sql
-- Allow public read access to portfolio-images bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio-images');

-- Allow authenticated users to upload (we'll use service role for admin)
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'portfolio-images'
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update/delete
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'portfolio-images'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'portfolio-images'
  AND auth.role() = 'authenticated'
);
```

**Note**: Since you're using password-based admin (not Supabase Auth), admin operations will use the service role key which bypasses these policies.

### 3. Update Environment Variables

Your existing Supabase variables are sufficient. The service role key has full access to storage.

## Image URLs in Database

When using Supabase Storage, image URLs will look like:

```
https://[project-ref].supabase.co/storage/v1/object/public/portfolio-images/1766393269452-axbkv7ee47r.jpg
```

These URLs are:

- **Publicly accessible** (no authentication needed)
- **CDN-optimized** (fast loading)
- **Persistent** (won't break on redeploy)

## Migration from Local to Supabase Storage

If you have existing images in `public/uploads/`, you can:

1. Upload them manually to Supabase Storage via the dashboard
2. Or create a migration script to upload them programmatically
3. Update the database URLs to point to Supabase Storage URLs

The updated upload route (see below) will automatically use Supabase Storage for new uploads.
