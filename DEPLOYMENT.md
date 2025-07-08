# Deployment Guide

## Environment Variables Setup

This application uses Supabase for authentication and database management. To deploy successfully, you need to configure environment variables for your deployment environment.

### Required Environment Variables

1. **VITE_SUPABASE_URL** - Your Supabase project URL
2. **VITE_SUPABASE_ANON_KEY** - Your Supabase anonymous key
3. **VITE_REDIRECT_URL** (optional) - Custom redirect URL (defaults to window.location.origin)

### Local Development

Create a `.env.local` file in the root directory:

```bash
VITE_SUPABASE_URL=https://nsqushsijqnlstgwgkzx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zcXVzaHNpanFubHN0Z3dna3p4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NTA2OTksImV4cCI6MjA2NzEyNjY5OX0.v0zmEJ83t1tI9Obt-ofjk6SJ3VxynkOoKJIwpDGLc5g
VITE_REDIRECT_URL=http://localhost:3000
```

### Vercel Deployment

1. **Set Environment Variables in Vercel Dashboard:**
   - Go to your project settings in Vercel
   - Navigate to the "Environment Variables" section
   - Add the following variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
     - `VITE_REDIRECT_URL`: Your production domain (e.g., `https://your-app.vercel.app`)

2. **Configure Supabase Auth Settings:**
   - Go to your Supabase project dashboard
   - Navigate to Authentication > URL Configuration
   - Add your production domain to the "Redirect URLs" list:
     - `https://your-app.vercel.app`
     - `https://your-app.vercel.app/auth/callback`
   - Save the changes

### Other Deployment Platforms

For other platforms (Netlify, Railway, etc.), follow the same pattern:

1. Set the environment variables in your platform's dashboard
2. Configure the redirect URLs in your Supabase project settings
3. Ensure the `VITE_REDIRECT_URL` matches your production domain

### Important Notes

- The application automatically detects the current origin for redirects in most cases
- The `VITE_REDIRECT_URL` is only needed if you want to override the automatic detection
- Always add your production domain to Supabase's allowed redirect URLs
- Never commit sensitive environment variables to version control

### Troubleshooting

If you're still getting authentication errors:

1. Check that your environment variables are correctly set in your deployment platform
2. Verify that your production domain is added to Supabase's redirect URLs
3. Clear your browser cache and try again
4. Check the browser console for any authentication-related errors 