/**
 * Browser-based utility to generate thumbnails from project videos
 * This can be run in the browser console or as a one-time script
 */

export interface ThumbnailGenerationResult {
  videoPath: string;
  thumbnailData: string | null;
  error?: string;
}

/**
 * Extract thumbnail from a video file
 * @param videoPath - Path to the video file
 * @returns Promise with thumbnail data URL or null
 */
export async function extractThumbnailFromVideo(
  videoPath: string
): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const handleCanPlay = () => {
      try {
        // Seek to 1 second (or beginning if video is shorter)
        video.currentTime = Math.min(1, video.duration);
      } catch (error) {
        console.error('Error seeking video:', error);
        cleanup();
        resolve(null);
      }
    };

    const handleSeeked = () => {
      try {
        // Create canvas and extract frame
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1920;
        canvas.height = video.videoHeight || 1080;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        
        cleanup();
        resolve(thumbnailDataUrl);
      } catch (error) {
        console.error('Error extracting thumbnail:', error);
        cleanup();
        resolve(null);
      }
    };

    const handleError = (e: Event) => {
      console.error('Error loading video:', videoPath, e);
      cleanup();
      resolve(null);
    };

    const cleanup = () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('error', handleError);
      video.src = '';
      video.load();
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });
    video.addEventListener('seeked', handleSeeked, { once: true });
    video.addEventListener('error', handleError, { once: true });

    video.src = videoPath;
    video.load();
  });
}

/**
 * Generate thumbnails for multiple videos
 * @param videoPaths - Array of video paths
 * @returns Promise with array of results
 */
export async function generateThumbnailsForVideos(
  videoPaths: string[]
): Promise<ThumbnailGenerationResult[]> {
  const results: ThumbnailGenerationResult[] = [];

  for (const videoPath of videoPaths) {
    try {
      const thumbnailData = await extractThumbnailFromVideo(videoPath);
      results.push({
        videoPath,
        thumbnailData,
        error: thumbnailData ? undefined : 'Failed to extract thumbnail'
      });
    } catch (error) {
      results.push({
        videoPath,
        thumbnailData: null,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return results;
}

/**
 * Download thumbnail as an image file
 * @param dataUrl - Data URL of the thumbnail
 * @param filename - Name of the file to download
 */
export function downloadThumbnail(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Convert data URL to Blob
 * @param dataUrl - Data URL to convert
 * @returns Blob
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}
