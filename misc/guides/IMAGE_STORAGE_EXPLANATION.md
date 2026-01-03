# How Images Are Stored and Accessed

## The Flow

```
1. Database (Supabase) stores IMAGE URLS (text strings)
   ↓
2. Frontend fetches data from database via API
   ↓
3. Frontend displays images using those URLs
```

## Important: Database Stores URLs, Not Files

The Supabase `portfolio` table has an `image` column that stores **text URLs**, not the actual image files.

### Current Situation

Looking at your database, you likely have two types of image URLs:

#### 1. **Old/Local Paths** (from default data)
```
/modern-apartment-building.png
/commercial-building-modern.jpg
```
These point to files in your `public/` folder (local files on your server).

#### 2. **New/Supabase Storage URLs** (from new uploads)
```
https://[project-ref].supabase.co/storage/v1/object/public/portfolio-images/portfolio/1766393269452-axbkv7ee47r.jpg
```
These point to files in Supabase Storage (cloud).

## How It Works

### When Frontend Displays Images:

1. **Frontend fetches projects** from `/api/portfolio`
2. **API reads from Supabase database** → gets image URLs
3. **Frontend receives** data like:
   ```json
   {
     "id": 1,
     "title": "Жилищен комплекс",
     "image": "/modern-apartment-building.png",  // ← This is just a URL string
     ...
   }
   ```
4. **Frontend displays** using Next.js `<Image>` component:
   ```tsx
   <Image src={project.image} ... />
   ```
5. **Browser requests image** from wherever the URL points:
   - If URL is `/modern-apartment-building.png` → browser gets it from your server's `public/` folder
   - If URL is `https://xxx.supabase.co/...` → browser gets it from Supabase Storage CDN

## Both Types Work!

- ✅ **Local paths** (`/image.png`) work if files exist in `public/` folder
- ✅ **Supabase Storage URLs** work and are better for production

## What Happens Now

### New Uploads (After Setup)
- Upload via admin panel → Goes to Supabase Storage
- Database stores Supabase Storage URL
- Image served from Supabase CDN

### Existing Images
- Still work if files are in `public/` folder
- Will break if you deploy to a new server (files won't be there)
- **Solution**: Migrate them to Supabase Storage (see below)

## Migration: Moving Old Images to Supabase Storage

If you want to move existing local images to Supabase Storage:

1. **Upload images manually** to Supabase Storage via dashboard
2. **Update database URLs** to point to Supabase Storage URLs
3. **Or create a migration script** to do it automatically

## Summary

- **Database**: Stores URL strings (text)
- **Images**: Stored in either `public/` folder OR Supabase Storage bucket
- **Frontend**: Reads URLs from database, displays images from wherever URL points
- **New uploads**: Automatically go to Supabase Storage
- **Old images**: Still work but should be migrated for production

