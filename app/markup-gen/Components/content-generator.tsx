import React, { useState, useRef, useCallback } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

const ContentGenerator = () => {
  const [contentType, setContentType] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  const processStreamChunk = useCallback((data) => {
    if (data.done) {
      setIsLoading(false);
    } else if (data.error) {
      setError(data.error);
      setIsLoading(false);
    } else if (data.content) {
      setGeneratedContent(prevContent => prevContent + data.content);
    }
  }, []);

  const generateContent = async () => {
    setIsLoading(true);
    setGeneratedContent('');
    setError('');

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('Sending request to /api/gen-content');
      const response = await fetch('/api/gen-content', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contentType }),
        signal: abortControllerRef.current.signal,
      });

      console.log('Response received:', response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream complete');
          break;
        }

        const chunk = decoder.decode(value);
        console.log('Received chunk:', chunk);

        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              processStreamChunk(data);
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error in generateContent:', error);
      setError(`Error generating content: ${error.message}`);
    } finally {
      setIsLoading(false);
      if (generatedContent === '') {
        setError('Content generation timed out. Please try again.');
      }
    }
  };

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Streaming LLM Content Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              type="text"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              placeholder="Enter content type"
              className="flex-grow"
            />
            <Button onClick={generateContent} disabled={isLoading}>
              {isLoading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedContent && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Generated Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div dangerouslySetInnerHTML={{ __html: generatedContent }} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HTML Source</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
                <code>{generatedContent}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentGenerator;
