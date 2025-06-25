# wavr Setup Guide

This guide will help you set up the wavr application with Supabase authentication and database.

## Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- Git for version control

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project dashboard under Settings > API.

## Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL commands from `database/schema.sql` to create the required tables:
   - `invites` table for managing registration invite codes
   - `profiles` table for user profile information

## Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Application Structure

### Pages
- `/` - Home page
- `/login` - User login
- `/register` - User registration with invite code validation
- `/dashboard` - User dashboard after login
- `/profile/setup` - Profile completion page

### Components
- `RegisterForm` - Handles user registration with Supabase
- UI components from shadcn/ui (Button, Card, Input, Label)

### Database Tables

#### invites
- `id` - UUID primary key
- `code` - Unique invite code (TEXT)
- `status` - 'approved' or 'used'
- `created_at`, `updated_at` - Timestamps

#### profiles
- `id` - UUID, references auth.users(id)
- `role` - 'artist' or 'producer'
- `display_name` - User's display name
- `skills` - Array of skills/genres
- `media_urls` - Array of media URLs
- `socials` - JSON object with social media links
- `profile_complete` - Boolean flag
- `created_at`, `updated_at` - Timestamps

## Testing

Use these sample invite codes for testing:
- `STUDIO2024`
- `MUSIC001`
- `ARTIST100`
- `PRODUCER50`

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel or your preferred hosting platform
3. Add environment variables in your hosting platform's dashboard
4. Deploy!

## Features

- ✅ Supabase authentication
- ✅ Invite code validation
- ✅ User profile management
- ✅ Role-based registration (Artist/Producer)
- ✅ Responsive design with Tailwind CSS
- ✅ Modern UI with shadcn/ui components
- ✅ Mobile-first approach 