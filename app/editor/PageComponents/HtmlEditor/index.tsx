import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Card } from '@/components/ui/card';

const HTMLEditor = ({ initialValue = '', onChange = () => {} }) => {
  const [content, setContent] = useState(initialValue || `
  <h1>Hello World!</h1>
  <p>Start editing to see live changes!</p>
`);

  const handleEditorChange = (value) => {
    setContent(value);
    onChange(value);
  };

  return (
    <Card className="w-full">
      <div className="flex h-[500px] gap-4 p-4">
        <div className="flex-1 flex flex-col">
          <div className="text-sm font-medium mb-2">HTML Editor</div>
          <div className="flex-1 border rounded-md overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage="html"
              defaultValue={content}
              onChange={handleEditorChange}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                roundedSelection: false,
                padding: { top: 10 },
                lineNumbers: 'on',
                glyphMargin: false,
              }}
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-sm font-medium mb-2">Live Preview</div>
          <div className="flex-1 border rounded-md overflow-hidden bg-white">
            <iframe
              className="w-full h-full"
              srcDoc={content}
              title="preview"
              sandbox="allow-scripts"
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HTMLEditor;