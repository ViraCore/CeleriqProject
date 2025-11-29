import { useState } from 'react';
import { projects } from '@/data/projects';
import { 
  extractThumbnailFromVideo, 
  downloadThumbnail,
  ThumbnailGenerationResult 
} from '@/utils/generateThumbnails';
import { Button } from '@/components/ui/button';
import { Download, Loader2, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Component to generate and download thumbnails for all project videos
 * This is a utility component for development/setup purposes
 * Access it at /thumbnail-generator route
 */
const ThumbnailGenerator = () => {
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<ThumbnailGenerationResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const generateAllThumbnails = async () => {
    setGenerating(true);
    setResults([]);
    setCurrentIndex(0);

    const newResults: ThumbnailGenerationResult[] = [];

    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      setCurrentIndex(i + 1);

      try {
        const thumbnailData = await extractThumbnailFromVideo(project.videoPath);
        
        const result: ThumbnailGenerationResult = {
          videoPath: project.videoPath,
          thumbnailData,
          error: thumbnailData ? undefined : 'Failed to extract thumbnail'
        };

        newResults.push(result);
        setResults([...newResults]);

        // Auto-download if successful
        if (thumbnailData) {
          const filename = `project-${project.id}-thumbnail.jpg`;
          downloadThumbnail(thumbnailData, filename);
          
          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        newResults.push({
          videoPath: project.videoPath,
          thumbnailData: null,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        setResults([...newResults]);
      }
    }

    setGenerating(false);
  };

  const generateSingle = async (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    try {
      const thumbnailData = await extractThumbnailFromVideo(project.videoPath);
      if (thumbnailData) {
        const filename = `project-${project.id}-thumbnail.jpg`;
        downloadThumbnail(thumbnailData, filename);
      }
    } catch (error) {
      console.error('Failed to generate thumbnail:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Thumbnail Generator</h1>
          <p className="text-muted-foreground">
            Generate thumbnails for all project videos. Thumbnails will be automatically downloaded.
          </p>
        </div>

        <div className="mb-6 p-6 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            <li>Click "Generate All Thumbnails" button below</li>
            <li>Wait for all thumbnails to be generated and downloaded</li>
            <li>Save the downloaded thumbnails to <code className="bg-muted px-2 py-1 rounded">/public/images/thumbnails/</code></li>
            <li>Name them as: <code className="bg-muted px-2 py-1 rounded">project-[id]-thumbnail.jpg</code></li>
            <li>Update the projects.ts file with the correct thumbnail paths</li>
          </ol>
        </div>

        <div className="mb-6">
          <Button
            onClick={generateAllThumbnails}
            disabled={generating}
            size="lg"
            className="w-full"
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating... ({currentIndex} / {projects.length})
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Generate All Thumbnails
              </>
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Results</h2>
            <div className="space-y-2">
              {results.map((result, index) => {
                const project = projects[index];
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      {result.thumbnailData ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project?.title || 'Unknown'}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {result.videoPath}
                        </p>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                      </div>
                    </div>
                    {result.thumbnailData && (
                      <div className="flex items-center gap-2">
                        <img
                          src={result.thumbnailData}
                          alt={`Thumbnail for ${project?.title}`}
                          className="h-16 w-28 object-cover rounded border"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => project && generateSingle(project.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-8 p-4 border rounded-lg bg-muted/50">
          <h3 className="font-semibold mb-2">Individual Generation</h3>
          <div className="grid grid-cols-3 gap-2">
            {projects.map(project => (
              <Button
                key={project.id}
                variant="outline"
                size="sm"
                onClick={() => generateSingle(project.id)}
                className="text-xs"
              >
                Project {project.id}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumbnailGenerator;
