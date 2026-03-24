#!/bin/bash

# Database setup script for rkade
echo "Setting up database for rkade..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "Not in a Supabase project. Please run 'supabase init' first."
    exit 1
fi

echo "Starting Supabase local development..."
supabase start

echo "Applying database schema..."
supabase db reset

echo "Adding sample events..."
psql -h localhost -p 54322 -U postgres -d postgres -f sample-events.sql

echo "Database setup complete!"
echo "You can now run 'npm run dev' to start the development server."
