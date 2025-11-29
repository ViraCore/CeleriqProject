/**
 * Script to generate thumbnails from project videos
 * Run with: node scripts/generate-thumbnails.js
 * 
 * This script:
 * 1. Reads all project videos from /public/videos/projects/
 * 2. Extracts the first frame as a thumbnail
 * 3. Saves thumbnails to /public/images/thumbnails/
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const VIDEOS_DIR = path.join(__dirname, '../frontend/public/videos/projects');
const THUMBNAILS_DIR = path.join(__dirname, '../frontend/public/images/thumbnails');

// Ensure thumbnails directory exists
if (!fs.existsSync(THUMBNAILS_DIR)) {
  fs.mkdirSync(THUMBNAILS_DIR, { recursive: true });
  console.log('✓ Created thumbnails directory');
}

// Function to generate thumbnail using ffmpeg
function generateThumbnail(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Extract frame at 1 second mark (or 0 if video is shorter)
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoPath,
      '-ss', '00:00:01', // Seek to 1 second
      '-vframes', '1', // Extract 1 frame
      '-q:v', '2', // High quality
      '-y', // Overwrite output file
      outputPath
    ]);

    let stderr = '';

    ffmpeg.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        reject(new Error(`ffmpeg failed with code ${code}: ${stderr}`));
      }
    });

    ffmpeg.on('error', (err) => {
      reject(err);
    });
  });
}

// Main function
async function main() {
  console.log('🎬 Starting thumbnail generation...\n');

  // Check if ffmpeg is available
  try {
    await new Promise((resolve, reject) => {
      const check = spawn('ffmpeg', ['-version']);
      check.on('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error('ffmpeg not found'));
      });
      check.on('error', reject);
    });
    console.log('✓ ffmpeg is available\n');
  } catch (error) {
    console.error('❌ Error: ffmpeg is not installed or not in PATH');
    console.error('   Please install ffmpeg to generate thumbnails');
    console.error('   - Ubuntu/Debian: sudo apt-get install ffmpeg');
    console.error('   - macOS: brew install ffmpeg');
    console.error('   - Windows: Download from https://ffmpeg.org/download.html');
    process.exit(1);
  }

  // Check if videos directory exists
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.error(`❌ Error: Videos directory not found: ${VIDEOS_DIR}`);
    process.exit(1);
  }

  // Get all video files
  const videoFiles = fs.readdirSync(VIDEOS_DIR)
    .filter(file => /\.(mp4|webm|mov|avi)$/i.test(file));

  if (videoFiles.length === 0) {
    console.log('⚠️  No video files found in videos directory');
    process.exit(0);
  }

  console.log(`Found ${videoFiles.length} video file(s)\n`);

  // Generate thumbnails
  let successCount = 0;
  let failCount = 0;

  for (const videoFile of videoFiles) {
    const videoPath = path.join(VIDEOS_DIR, videoFile);
    const thumbnailName = videoFile.replace(/\.[^.]+$/, '.jpg');
    const thumbnailPath = path.join(THUMBNAILS_DIR, thumbnailName);

    try {
      console.log(`Processing: ${videoFile}`);
      await generateThumbnail(videoPath, thumbnailPath);
      console.log(`✓ Generated: ${thumbnailName}\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed: ${videoFile}`);
      console.error(`   ${error.message}\n`);
      failCount++;
    }
  }

  // Summary
  console.log('━'.repeat(50));
  console.log(`\n✨ Thumbnail generation complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);
  console.log(`   Total: ${videoFiles.length}\n`);
  console.log(`📁 Thumbnails saved to: ${THUMBNAILS_DIR}\n`);
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
