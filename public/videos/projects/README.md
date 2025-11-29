# Project Videos

Add your project demo videos here with the following naming convention:

## File Naming
- `project-1.mp4` - Skull Reconstruction
- `project-2.mp4` - Skin Disease Detection
- `project-3.mp4` - Head and Neck Segmentation
- `project-4.mp4` - Owner Renter
- `project-5.mp4` - Mock Interview Platform
- `project-6.mp4` - Cancer Website
- `project-7.mp4` - Gee Ess Opticals
- `project-8.mp4` - Rajasthan Diamonds Website

## Video Requirements
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Duration**: 10-30 seconds for best experience
- **File Size**: Keep under 10MB for fast loading
- **Aspect Ratio**: 16:9 (landscape)

## Tips for Creating Project Videos
1. **Screen Recording**: Use OBS Studio, Loom, or QuickTime to record your project
2. **Highlights**: Show the most impressive features in the first few seconds
3. **No Audio**: Videos will play muted on hover
4. **Smooth Navigation**: Show smooth transitions between features
5. **Compression**: Use HandBrake or FFmpeg to compress without losing quality

## Compression Command (FFmpeg)
```bash
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -vf "scale=1280:720" -b:v 1000k project-X.mp4
```

## Current Setup
Until you add your videos, the cards will show:
- Gradient backgrounds with your project's accent color
- Play icon overlay
- The video will attempt to load but gracefully fallback to the gradient if not found

## Next Steps
1. Record/gather your project demos
2. Name them according to the list above
3. Place them in this folder: `/frontend/public/videos/projects/`
4. Refresh the website to see them in action!
