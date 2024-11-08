import React, { useState, useRef, useEffect } from 'react';
import { Component } from '../Components';
import Editor from '@monaco-editor/react';
import { useCompletion } from 'ai/react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PropertiesPanelProps {
  selectedComponent: { type: string; props: any } | null;
  componentMap: { [key: string]: Component<any> };
  onUpdateComponent: (updatedProps: any) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  selectedComponent,
  componentMap,
  onUpdateComponent
}) => {

  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p>No component selected</p>
      </div>
    );
  }

  const componentConfig = componentMap[selectedComponent.type];
  const fields = componentConfig.fields || {};

  const handleChange = (key: string, value: any) => {
    onUpdateComponent({ ...selectedComponent.props, [key]: value });
    updateEditorHeight();
  };

  // GenAI markup generator
  const { completion, complete, input, handleInputChange, isLoading } = useCompletion({
    api: '/api/gen-content',
  });

  //const [generatedContent, setGeneratedContent] = useState('');
  

  const extractHtmlContentStreaming = (content: string) => {
    // Look for <snippet> open and close tags and return the content inside
    const snippetStartIndex = content.indexOf('<snippet');
    const snippetEndIndex = content.indexOf('</snippet>');
    let markup = "";
    if (snippetStartIndex !== -1) {
      markup = content.slice(snippetStartIndex);
      if (snippetEndIndex !== -1) {
        markup = content.slice(snippetStartIndex, snippetEndIndex + 10);
        console.log('markup', markup);
      }
    }
    return markup;
  };

  useEffect(() => {
    if (completion && editorRef.current) {
      //console.log('completion', completion);
      editorRef.current.getModel().setValue(extractHtmlContentStreaming(completion));
    }
  }, [completion]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //setGeneratedContent('');
    //setRenderedHtml('');
    await complete(input);
  };

  // HTML Editor height functionality
  const [editorHeight, setEditorHeight] = useState('200px'); // Initial height for ~10 lines
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor: any) => {
    console.log('editor', editor);
    editorRef.current = editor;
    updateEditorHeight();
  };

  const updateEditorHeight = () => {
    if (editorRef.current) {
      const lineHeight = 20; // Approximate line height in pixels
      const lineCount = editorRef.current.getModel().getLineCount();
      const padding = 200; // Additional padding
      const minHeight = 200; // Minimum height (~10 lines)
      const newHeight = Math.max(minHeight, (lineCount * lineHeight) + padding);
      setEditorHeight(`${newHeight}px`);
    }
  };

  // Update height on initial content
  useEffect(() => {
    if (editorRef.current) {
      updateEditorHeight();
    }
  }, []);

  // Debug logs
  //console.log('fields', fields);
  //console.log('selectedComponent', selectedComponent);

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      <h3 className="text-md font-semibold mb-2">{componentConfig.label || selectedComponent.type}</h3>
      {Object.entries(fields).map(([key, field]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium text-gray-700">{field.label || key}</label>
          {
            field.type === 'select' ? (
              <select value={selectedComponent.props[key] || ''} onChange={(e) => handleChange(key, e.target.value)}>
                {field.options.map((option) => (
                  <option key={String(option.value)} value={String(option.value)}>{option.label}</option>
                ))}
              </select>
            ) : field.type === 'textarea' ? (
              <textarea
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 resize-y min-h-[200px]"
              />
            ) : field.type === 'html' ? (
              <div className="border rounded-md overflow-hidden" style={{ height: editorHeight }}>
                  <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2 mb-5">
                    <Input
                      value={input}
                      placeholder="Enter content type..."
                      onChange={handleInputChange}
                      className="block w-full" 
                    />
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? 'Generating...' : 'Generate'}
                    </Button>
                  </form>
                <Editor
                  height="100%"
                  defaultLanguage="html"
                  defaultValue={selectedComponent.props[key] || ''}
                  onChange={(value) => handleChange(key, value || '')}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 12,
                    wordWrap: 'on',
                    scrollBeyondLastLine: true,
                    roundedSelection: false,
                    padding: { top: 10 },
                    lineNumbers: 'off',
                    glyphMargin: false,
                    automaticLayout: true,
                    lineHeight: 19,
                    theme: 'vs-dark',
                  }}
                />
              </div>
            ) : (
              <input
                type="text"
                value={selectedComponent.props[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              />
            )
          }
        </div>
      ))}
    </div>
  );
};

export default PropertiesPanel;
