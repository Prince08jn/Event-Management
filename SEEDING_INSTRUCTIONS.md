# Team Event Seed Script

This directory contains scripts to seed your database with sample team events.

## Quick Setup (Recommended)

If you have Supabase CLI set up:

```bash
# Apply the team functionality migration first
npx supabase db push

# Then run the SQL seed file
npx supabase db sql --file seed-team-events.sql
```

## Alternative: Manual Database Setup

If you don't have Supabase CLI configured, you can:

1. **Apply the migration manually:**
   - Go to your Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `supabase/migrations/20241124_add_team_functionality.sql`
   - Execute the SQL

2. **Seed the events:**
   - In Supabase Dashboard → SQL Editor
   - Copy and paste the contents of `seed-team-events.sql` 
   - Execute the SQL

## Alternative: Node.js Script

If you prefer using Node.js:

```bash
# Set your environment variables first
export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"

# Run the seed script
node seed-team-events.js
```

## What Gets Created

### Team Events:
1. **Campus Hackathon 2025** (Teams: 2-5 members)
   - Slug: `campus-hackathon-2025`
   - 24-hour coding competition
   - Sample teams: Code Warriors (CW2024), Tech Innovators (TI2024), Binary Builders (BB2024)

2. **Inter-College Cricket Tournament** (Teams: 11-15 members)
   - Slug: `inter-college-cricket-tournament`
   - Full cricket team competition

3. **Campus Coding Competition** (Teams: 2-3 members)
   - Slug: `campus-coding-competition`
   - Algorithmic programming challenge

### Sample Users:
- student1@campus.edu (John Doe) - Team lead for Code Warriors
- student2@campus.edu (Jane Smith) - Team lead for Tech Innovators  
- student3@campus.edu (Mike Johnson) - Team lead for Binary Builders
- Additional team members and coordinators

### Sample Teams (for Hackathon):
- **Code Warriors** (Code: CW2024) - 3 members
- **Tech Innovators** (Code: TI2024) - 2 members
- **Binary Builders** (Code: BB2024) - 1 member

## Testing the Team Functionality

After seeding:

1. **Visit a team event:** Go to `/events/campus-hackathon-2025`
2. **Sign in** with one of the sample users (you'll need to set up authentication)
3. **Join a team** using codes: CW2024, TI2024, or BB2024
4. **Create a new team** and get your own unique code
5. **Test team management** (leave, delete, view members)

## Viewing the Events

The seeded team events will appear in your event listings with:
- ✅ Team functionality enabled
- 🔢 Min/max team size limits
- 👥 Existing teams (for hackathon)
- 🎯 Proper campus event categorization

Visit your app's events page to see them in action!