# Thumbnail Generation Guide

This guide explains how to generate thumbnails for your project videos.

## Overview

The application now displays static video thumbnails on project cards instead of gradient placeholders. Thumbnails are:
- Extracted from the first frame of each project video
- Lazy-loaded as cards come into view
- Cached as static images for optimal performance

## Method 1: Browser-Based Generation (Recommended for Quick Setup)

### Steps:

1. **Start the development server:**
   ```bash
   cd frontend
   yarn dev
   ```

2. **Open the Thumbnail Generator:**
   Navigate to: `http://localhost:3000/thumbnail-generator`

3. **Generate thumbnails:**
   - Click "Generate All Thumbnails" button
   - Wait for all thumbnails to be generated
   - Thumbnails will automatically download to your Downloads folder

4. **Save thumbnails:**
   - Move the downloaded thumbnails to: `/frontend/public/images/thumbnails/`
   - Ensure they are named: `project-[id]-thumbnail.jpg`
   - Example: `project-1-thumbnail.jpg`, `project-2-thumbnail.jpg`, etc.

5. **Verify:**
   - Refresh your main page
   - You should now see video thumbnails on the project cards

### Individual Generation:

If you need to regenerate a specific thumbnail:
1. Go to `/thumbnail-generator`
2. Click on the individual "Project [number]" button at the bottom
3. Save the downloaded thumbnail

## Method 2: Server-Side Generation with FFmpeg

If you prefer to generate thumbnails via command line:

### Prerequisites:

Install FFmpeg:
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Steps:

1. **Run the generation script:**
   ```bash
   cd /app
   node scripts/generate-thumbnails.js
   ```

2. **Verify output:**
   - Thumbnails will be saved to `/frontend/public/images/thumbnails/`
   - Check console for success/failure messages

## Thumbnail Specifications

- **Format:** JPEG
- **Quality:** 85%
- **Naming:** `project-[id]-thumbnail.jpg`
- **Extraction Point:** 1 second into the video (or beginning if video is shorter)
- **Dimensions:** Match original video dimensions (typically 1920x1080)

## Troubleshooting

### Thumbnails not showing:

1. **Check file paths:**
   - Ensure thumbnails are in `/frontend/public/images/thumbnails/`
   - Verify filenames match: `project-[id]-thumbnail.jpg`

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for 404 errors on thumbnail requests
   - Verify the thumbnail URLs being requested

3. **Clear browser cache:**
   ```
   Ctrl+Shift+R (Windows/Linux)
   Cmd+Shift+R (Mac)
   ```

4. **Verify project IDs:**
   - Check `/frontend/src/data/projects.ts`
   - Ensure thumbnail paths match project IDs

### Fallback behavior:

If a thumbnail fails to load:
- The card will display the gradient + Play icon fallback
- Check browser console for specific error messages
- Verify the video file exists at the specified path

## Testing

After generating thumbnails:

1. **Visual Test:**
   - Navigate to home page
   - Scroll through project cards
   - Verify thumbnails load as cards come into view

2. **Hover Test:**
   - Hover over cards
   - Video should play smoothly
   - Thumbnail should remain visible until video loads

3. **Performance Test:**
   - Open DevTools Network tab
   - Filter by "Img"
   - Verify thumbnails load progressively (lazy loading)

## File Structure

```
frontend/
├── public/
│   ├── images/
│   │   └── thumbnails/
│   │       ├── project-1-thumbnail.jpg
│   │       ├── project-2-thumbnail.jpg
│   │       └── ... (up to project-9)
│   └── videos/
│       └── projects/
│           ├── project-1.mp4
│           └── ...
├── src/
│   ├── components/
│   │   ├── ProjectCard.tsx (updated)
│   │   └── ThumbnailGenerator.tsx (new)
│   ├── utils/
│   │   └── generateThumbnails.ts (new)
│   └── data/
│       └── projects.ts (updated)
```

## Notes

- Thumbnails are static images, not dynamically generated on each page load
- This approach provides better performance and user experience
- Lazy loading ensures thumbnails only load when cards are near the viewport
- The gradient fallback provides a smooth user experience while thumbnails load
