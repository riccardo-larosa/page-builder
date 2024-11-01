import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCompletion } from 'ai/react';
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-markup';


const ContentGenerator = () => {
  const { completion, complete, input, handleInputChange, isLoading } = useCompletion({
    api: '/api/gen-content',
  });

  const [generatedContent, setGeneratedContent] = useState('');
  const [renderedHtml, setRenderedHtml] = useState('');

  const extractHtmlContent = (content: string) => {
    // Look for <snippet> open and close tags and return the content inside
    const snippetStartIndex = content.indexOf('<snippet');
    const snippetEndIndex = content.indexOf('</snippet>');
    if (snippetStartIndex !== -1 && snippetEndIndex !== -1) {
      // Return everything from the first HTML tag onwards
      return content.slice(snippetStartIndex, snippetEndIndex + 8);
    }
    // If no HTML tag is found, return empty string
    return "";
  };

  useEffect(() => {
    if (completion) {
      const htmlContent = extractHtmlContent(completion);
      setGeneratedContent(completion); // Keep the full content for display
      setRenderedHtml(htmlContent); // Set only the HTML part for rendering
      //console.log(htmlContent);
    }
  }, [completion]);

  useEffect(() => {
    if (generatedContent) {
      Prism.highlightAll();
      console.log(generatedContent);
    }
  }, [generatedContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedContent('');
    setRenderedHtml('');
    await complete(input);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="w-full flex gap-2">
        <Input
          value={input}
          placeholder="Enter content type..."
          onChange={handleInputChange}
          className="flex-grow"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate'}
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-xs bg-gray-100 p-4 rounded-md overflow-x-auto">
              <code className="language-html">{generatedContent}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rendered HTML</CardTitle>
          </CardHeader>
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentGenerator;
