# Deployment Guide - Visual Workflow Builder

## Quick Deploy to Vercel

### Prerequisites
- A Vercel account (sign up at https://vercel.com)
- A GitHub account
- Your Neon PostgreSQL database URL

### Step 1: Push to GitHub

1. Initialize git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Visual Workflow Builder"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy on Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add: `DATABASE_URL` = `your-neon-database-url`
   - Example: `postgresql://neondb_owner:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

6. Click "Deploy"

### Step 3: Set Up Database

After deployment, your app will use localStorage as fallback if the database isn't connected. To enable the database:

1. The database schema is already in your Neon database (created during local setup)
2. The app will automatically detect and use it once `DATABASE_URL` is set
3. Templates will be stored in the database instead of localStorage

### Optional: Custom Domain

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain and follow the DNS configuration steps

## Environment Variables

Required for production:
- `DATABASE_URL` - Your PostgreSQL connection string from Neon

## Features

### Works Without Database
The app is designed to work perfectly with browser localStorage if the database isn't available:
- All workflows saved locally
- Templates auto-seeded to localStorage
- Seamless experience

### With Database
When DATABASE_URL is configured:
- Multi-user support
- Server-side persistence
- Centralized template management

## Post-Deployment

After deployment:
1. Visit your Vercel URL
2. Create your first workflow
3. Test template selection
4. Verify data persistence

## Troubleshooting

### Build Fails
- Check that all dependencies are in package.json
- Verify Node.js version compatibility (16.x or higher)

### Database Not Connecting
- Verify DATABASE_URL is correct in Vercel environment variables
- Check that Neon database is accessible
- App will fall back to localStorage automatically

### Templates Not Showing
- Clear browser cache and reload
- Templates auto-seed on first page visit
- Check browser console for errors

## Support

For issues or questions:
- Check the browser console for errors
- Verify environment variables in Vercel dashboard
- Test locally first with `npm run dev`
