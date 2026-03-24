# PowerShell script to create a team event via API
# Make sure your Next.js server is running first (npm run dev)

Write-Host "🏆 Creating Campus Hackathon team event..." -ForegroundColor Green

$body = @{
    eventName = "Campus Hackathon 2025"
    landscapePoster = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400"
    portraitPoster = "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=600"
    date = "2025-12-01"
    time = "09:00"
    duration = "24 hours"
    ageLimit = "U"
    language = "English"
    category = "campus-event"
    eventType = "event"
    venue = "Computer Science Building, Room 101"
    price = "Free"
    description = "Join the biggest campus hackathon of the year! Build innovative solutions to real-world problems with your team. Prizes worth ₹50,000 to be won. Form teams of 2-5 members and compete with the best minds on campus."
    performers = "Tech Community, Campus Innovation Club"
    isTeamEvent = $true
    minTeamSize = 2
    maxTeamSize = 5
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/events/create" -Method POST -Body $body -ContentType "application/json"
    
    Write-Host "✅ Team event created successfully!" -ForegroundColor Green
    Write-Host "Event ID: $($response.event.id)" -ForegroundColor Yellow
    Write-Host "Visit: http://localhost:3001/events/campus-hackathon-2025" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Error creating event: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $responseBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseBody)
        $responseText = $reader.ReadToEnd()
        Write-Host "Response: $responseText" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Blue
Write-Host "1. Visit the event page to see team functionality"
Write-Host "2. Sign in to create or join teams"
Write-Host "3. Test team codes and management features"