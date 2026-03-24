# How to Fix Service Worker 404 Error

## Quick Fix (Try This First)

1. **Clear Browser Cache**:
   - Press `Ctrl + Shift + Delete` (Windows) or `Cmd + Shift + Delete` (Mac)
   - Select "All time" and check "Cached images and files"
   - Click "Clear data"

2. **Clear Service Workers**:
   - Open Developer Tools (`F12`)
   - Go to "Application" tab
   - Click "Service Workers" in the left sidebar
   - Click "Unregister" for any service workers
   - Refresh the page

## Permanent Fix (Already Applied)

I've created the following files to prevent this issue:

### Files Created:
- `public/sw.js` - Minimal service worker that prevents 404 errors
- `public/sw-register.js` - Service worker registration script
- Updated `src/app/layout.tsx` - Added service worker script to head

### What This Does:
- Provides a minimal service worker that doesn't interfere with your app
- Prevents the browser from looking for a non-existent service worker
- Stops the 404 errors from appearing in the console

## Alternative Solutions

### Option A: Disable Service Worker Completely
If you don't want any service worker functionality, you can remove the script from layout.tsx and just keep the empty sw.js file.

### Option B: Browser Extension Issue
If the issue persists, it might be caused by a browser extension:
- Try opening the site in an incognito/private window
- Disable browser extensions one by one to identify the culprit

## Testing

After applying the fix:
1. Clear your browser cache
2. Refresh the page
3. Check the Network tab in Developer Tools
4. You should no longer see `GET /sw.js 404` errors

The service worker will now return a 200 status instead of 404, eliminating the error messages.
