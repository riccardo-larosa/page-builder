'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { Component } from '../Components';
import { Editor, type Monaco } from '@monaco-editor/react';
import { useCompletion } from 'ai/react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import type monaco from 'monaco-editor';

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorHeight, setEditorHeight] = useState('200px');
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const { completion, complete, input, handleInputChange, isLoading } = useCompletion({
    api: '/api/gen-content',
  });

  const updateEditorHeight = () => {
    const model = editorRef.current?.getModel();
    if (model) {
      const lineHeight = 20;
      const lineCount = model.getLineCount();
      const padding = 200;
      const minHeight = 200;
      const newHeight = Math.max(minHeight, (lineCount * lineHeight) + padding);
      setEditorHeight(`${newHeight}px`);
      console.log('lineCount', lineCount);
    }
    console.log('editorHeight', editorHeight);
  };

  const handleChange = (key: string, value: any) => {
    onUpdateComponent({ ...selectedComponent?.props, [key]: value });
    updateEditorHeight();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await complete(input);
  };

  const extractHtmlContentStreaming = (content: string) => {
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
      const model = editorRef.current.getModel();
      if (model) {
        model.setValue(extractHtmlContentStreaming(completion));
      }
    }
  }, [completion]);

  useEffect(() => {
    if (editorRef.current?.getModel()) {
      updateEditorHeight();
    }
  }, []);

  if (!selectedComponent) {
    return (
      <div className="w-64 bg-gray-100 p-4">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <p className="text-gray-500">Select a component to edit its properties</p>
      </div>
    );
  }

  const componentConfig = componentMap[selectedComponent.type];
  const fields = componentConfig.fields || {};

  const handleEditorDidMount = (editor: any) => {
    console.log('editor', editor);
    editorRef.current = editor;
    if (editor?.getModel()) {
      updateEditorHeight();
    }
  };

  return (
    <div className={cn(
      "transition-all duration-300 bg-gray-100 p-4 relative",
      isExpanded ? "w-1/2" : "w-64"
    )}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Properties</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 hover:bg-gray-200 rounded-full"
          title={isExpanded ? "Collapse panel" : "Expand panel"}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
      <h3 className="text-md font-semibold mb-2">
        {componentConfig.label || selectedComponent.type}
      </h3>
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
