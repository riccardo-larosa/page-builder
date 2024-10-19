import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Component } from './Components';

interface BuilderAreaProps {
  components: Array<{ type: string; props: any }>;
  componentMap: { [key: string]: Component<any> };
  onSelectComponent: (component: { type: string; props: any } | null) => void;
  onComponentsChange: (newComponents: Array<{ type: string; props: any }>) => void;
}

const BuilderArea: React.FC<BuilderAreaProps> = ({ 
  components, 
  componentMap,
  onSelectComponent,
  onComponentsChange
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'builder-area',
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectComponent = (index: number) => {
    setSelectedIndex(index);
    onSelectComponent(components[index]);
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex-grow bg-white p-4 border-2 border-dashed min-h-[500px] transition-colors duration-200 ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <h2 className="text-lg font-bold mb-4">Builder Area</h2>
      {components.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Drag and drop components here
        </div>
      )}
      {components.map((item, index) => {
        const ComponentToRender = componentMap[item.type].reactComponent;
        if (!ComponentToRender) {
          console.error(`Component type ${item.type} not found in componentMap`);
          return null;
        }
        return (
          <div 
            key={item.props.id} 
            onClick={() => handleSelectComponent(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`p-2 my-2 transition-all duration-200 ${
              hoveredIndex === index ? 'border-2 border-gray-400' : ''
            } ${
              selectedIndex === index ? 'border-2 border-blue-500' : ''
            }`}
          >
            <ComponentToRender {...item.props} />
          </div>
        );
      })}
    </div>
  );
};

export default BuilderArea;
