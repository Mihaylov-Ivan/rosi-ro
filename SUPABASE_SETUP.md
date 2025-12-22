# Supabase Setup Guide

This guide will help you connect your Next.js application to Supabase.

## Step 1: Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY`) - **Keep this secret!**

## Step 2: Set Up Environment Variables

Create a `.env.local` file in the root of your project (if it doesn't exist) and add:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Password (existing)
ADMIN_PASSWORD=your-secure-password-here
```

**Important Notes:**

- The `NEXT_PUBLIC_` prefix makes these variables available in the browser
- The `SUPABASE_SERVICE_ROLE_KEY` should **NEVER** be exposed to the client - it bypasses Row Level Security
- Never commit `.env.local` to version control (it's already in `.gitignore`)

## Step 3: Run the Database Schema

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open the `supabase-schema.sql` file from this project
4. Copy and paste the entire SQL script
5. Click **Run** to execute the script

This will create all necessary tables, insert default data, and set up Row Level Security policies.

## Step 4: Verify the Setup

1. Restart your Next.js development server:

   ```bash
   npm run dev
   ```

2. Visit your website - it should now load data from Supabase instead of mock data

3. Test the admin panel:
   - Go to `/admin/login`
   - Log in with your admin password
   - Try editing content - changes should persist in Supabase

## Troubleshooting

### Error: "Missing Supabase environment variables"

- Make sure your `.env.local` file exists in the project root
- Verify all three Supabase variables are set correctly
- Restart your development server after adding environment variables

### Error: "relation does not exist"

- Make sure you've run the `supabase-schema.sql` script in your Supabase SQL Editor
- Check that all tables were created successfully

### Admin operations failing

- Verify your `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- The service role key is needed for admin operations (create, update, delete)
- Public operations (read) use the anon key

### RLS (Row Level Security) issues

- The schema includes RLS policies that allow public reads and authenticated writes
- Since you're using a password-based admin system (not Supabase Auth), admin operations use the service role key which bypasses RLS
- If you encounter permission errors, check your RLS policies in the Supabase dashboard

## Database Structure

The database consists of the following tables:

- **portfolio** - Portfolio projects
- **portfolio_header** - Portfolio page header content
- **home_content** - Main home page content (hero, contact, footer as JSONB)
- **services** - Home page services (normalized table)
- **about_paragraphs** - About section paragraphs (normalized table)

All tables have automatic `created_at` and `updated_at` timestamps.

## Next Steps

- ✅ **Set up Supabase Storage for images** - See `SUPABASE_STORAGE_GUIDE.md` for detailed instructions
- You can add more tables or columns as needed
- Monitor your Supabase usage in the dashboard

## Image Storage

The application now uses **Supabase Storage** for image uploads instead of local file storage. This provides:

- Persistent storage across deployments
- CDN-optimized delivery
- Automatic scaling
- Free tier: 1GB storage, 2GB bandwidth/month

See `SUPABASE_STORAGE_GUIDE.md` for setup instructions.
