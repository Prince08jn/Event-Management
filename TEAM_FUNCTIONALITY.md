# Team Functionality Implementation

This implementation adds team creation and joining functionality for campus events. 

## Features Implemented

### 1. Database Schema
- Added team-related columns to `events` table:
  - `min_team_size`: Minimum team size (default: 1)
  - `max_team_size`: Maximum team size (default: 1)
  - `is_team_event`: Boolean flag to enable team functionality

- Created new tables:
  - `teams`: Stores team information with auto-generated 6-digit alphanumeric codes
  - `team_members`: Stores team membership relationships

### 2. Event Creation
- Added team settings section to event creation form
- Only shows for campus events
- Allows setting min and max team sizes when team functionality is enabled
- Includes validation to ensure min ≤ max team size

### 3. Team Management
- **Create Team**: Event participants can create teams with custom names
- **Join Team**: Users can join existing teams using 6-digit team codes
- **View Teams**: See all teams for an event and their member counts
- **Team Administration**: Team creators can delete teams, members can leave

### 4. Team Codes
- Automatically generated 6-digit alphanumeric codes (e.g., "AB12CD")
- Unique across all teams
- Case-insensitive when joining

### 5. API Endpoints
- `POST /api/teams` - Create a new team
- `GET /api/teams?eventId=<id>` - Get all teams for an event
- `GET /api/teams?eventId=<id>&userEmail=<email>` - Get user's team for an event
- `POST /api/teams/join` - Join a team using team code
- `DELETE /api/teams/[teamId]` - Leave a team
- `DELETE /api/teams/[teamId]?action=delete` - Delete a team (creator only)

### 6. UI Components
- **TeamSettings**: Component for event creation form
- **TeamManagement**: Component for event detail pages with full team functionality
- Responsive design for both desktop and mobile views

## Setup Instructions

### 1. Database Migration
Run the migration to create the necessary tables:

```sql
-- This is in supabase/migrations/20241124_add_team_functionality.sql
-- Apply this to your Supabase database either through the dashboard or CLI
```

### 2. Environment Variables
Ensure your `.env.local` file has the required Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Usage

#### Creating a Team Event
1. Go to `/events/create`
2. Set category to "campus-event" or "Campus Event"
3. Enable "Team participation" checkbox
4. Set minimum and maximum team sizes
5. Create the event

#### Using Teams as a Participant
1. Navigate to a team-enabled event
2. Sign in to your account
3. Choose to either:
   - **Create Team**: Enter a team name and get a shareable team code
   - **Join Team**: Enter a 6-digit team code to join an existing team

#### Team Management
- Team creators can delete the entire team
- Team members can leave the team
- Team codes are displayed for easy sharing
- Team member lists show creator and current user clearly

## File Structure

```
src/
├── components/
│   └── events/
│       ├── TeamManagement.tsx      # Main team UI component
│       └── create/
│           └── TeamSettings.tsx    # Event creation team settings
├── lib/
│   └── teams.ts                    # Team-related backend functions
├── types/
│   └── event.ts                   # Updated with team types
└── app/
    └── api/
        └── teams/                 # Team API endpoints
            ├── route.ts
            ├── join/
            │   └── route.ts
            └── [teamId]/
                └── route.ts

supabase/
└── migrations/
    └── 20241124_add_team_functionality.sql  # Database schema
```

## Business Rules

1. **Team Events Only**: Team functionality only appears for events marked as team events
2. **Campus Events**: Team settings only show for campus event category
3. **One Team Per Event**: Users can only be part of one team per event
4. **Team Size Limits**: Teams are restricted by the min/max sizes set by event creators
5. **Creator Privileges**: Team creators cannot leave their team but can delete it
6. **Authentication Required**: All team operations require user authentication

## Technical Details

- Uses NextJS App Router with server-side data fetching
- Supabase for database operations with Row Level Security
- Real-time team updates when members join/leave
- Responsive design with Tailwind CSS
- Type-safe with TypeScript
- Form validation with Zod schemas