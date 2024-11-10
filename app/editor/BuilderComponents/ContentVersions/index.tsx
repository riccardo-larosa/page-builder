import { Button } from "@/components/ui/button";
import React from "react";

function ContentVersions({ contentId }: { contentId?: string }) {
    const [versions, setVersions] = React.useState<any[]>([]);
    console.log('versions', versions);
    React.useEffect(() => {
      if (!contentId) return;
      console.log('contentId', contentId);

      async function fetchVersions() {
        const response = await fetch(`/api/content/${contentId}/versions`);
        const data = await response.json();
        console.log('data', data);
        setVersions(Array.isArray(data.data) ? data.data : []);
      }
      
      fetchVersions();
    }, [contentId]);
  
    return (
      <div className="py-4">
        {Array.isArray(versions) && versions.map((version, index) => (
          <div 
            key={version.id} 
            className={`border-b p-4 ${index === 0 ? 'bg-gray-50' : ''}`}
          >
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {new Date(version.meta.timestamps.created_at).toLocaleString()}
              </p>
              {index === 0 ? (
                <span className="text-sm font-medium text-gray-600">
                  Current Version
                </span>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {/* Add restore functionality */}}
                >
                  Restore
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

export default ContentVersions;