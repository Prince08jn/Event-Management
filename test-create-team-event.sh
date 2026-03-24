#!/bin/bash

# Test script to create a team event via API
# Make sure your Next.js server is running first (npm run dev)

echo "🏆 Creating Campus Hackathon team event..."

curl -X POST http://localhost:3001/api/events/create \
  -H "Content-Type: application/json" \
  -d '{
    "eventName": "Campus Hackathon 2025",
    "landscapePoster": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400",
    "portraitPoster": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600",
    "date": "2025-12-01",
    "time": "09:00",
    "duration": "24 hours",
    "ageLimit": "U",
    "language": "English",
    "category": "campus-event",
    "eventType": "event",
    "venue": "Computer Science Building, Room 101",
    "price": "Free",
    "description": "Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus.",
    "performers": "Tech Community, Campus Innovation Club",
    "isTeamEvent": true,
    "minTeamSize": 2,
    "maxTeamSize": 5
  }'

echo ""
echo "✅ Team event creation request sent!"
echo "Visit http://localhost:3001/events/campus-hackathon-2025 to see the team functionality"