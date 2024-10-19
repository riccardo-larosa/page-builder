import React from 'react';
import { Component } from './Components';

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
  };

  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      <h3 className="text-md font-semibold mb-2">{componentConfig.label || selectedComponent.type}</h3>
      {Object.entries(fields).map(([key, field]) => (
        <div key={key} className="mb-2">
          <label className="block text-sm font-medium text-gray-700">{field.label || key}</label>
          <input
            type="text"
            value={selectedComponent.props[key] || ''}
            onChange={(e) => handleChange(key, e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>
      ))}
    </div>
  );
};

export default PropertiesPanel;
