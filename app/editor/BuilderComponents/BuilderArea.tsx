import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Component } from '../Components';
import { Trash, Monitor, Tablet, Smartphone } from "lucide-react"

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
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const handleSelectComponent = (index: number) => {
    setSelectedIndex(index);
    onSelectComponent(components[index]);
  };

  const handleDeleteComponent = (index: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering selection when deleting
    const newComponents = components.filter((_, i) => i !== index);
    onComponentsChange(newComponents);
    setSelectedIndex(null);
    onSelectComponent(null);
  };

  return (
    <div 
      ref={setNodeRef}
      className={`flex-grow bg-white p-4 border-2 border-dashed min-h-[500px] transition-colors duration-200 ${
        isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
      }`}
    >
      <div className="flex mb-4  bg-gray-100 p-2 rounded-lg justify-center">
        
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg ">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded ${viewport === 'desktop' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Desktop view"
          >
            <Monitor className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded ${viewport === 'tablet' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Tablet view"
          >
            <Tablet className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded ${viewport === 'mobile' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
            title="Mobile view"
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className={`mx-auto transition-all duration-300 border-2 border-gray-300 rounded-lg ${
        viewport === 'mobile' ? 'max-w-[375px]' : 
        viewport === 'tablet' ? 'max-w-[768px]' : 
        'max-w-none'
      }`}>
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
              className={`relative p-2 my-2 transition-all duration-200 ${
                hoveredIndex === index ? 'border-2 border-gray-400' : ''
              } ${
                selectedIndex === index ? 'border-2 border-blue-500' : ''
              }`}
            >
              {selectedIndex === index && (
                <div className="absolute -top-8 right-0 bg-blue-500 text-white px-2 py-1 rounded-t-md flex items-center shadow-md">
                  <span className="mr-2 text-sm">{componentMap[item.type].label || item.type}</span>
                  <button 
                    onClick={(e) => handleDeleteComponent(index, e)} 
                    className="text-white hover:text-red-300 focus:outline-none"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              )}
              <ComponentToRender {...item.props} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuilderArea;
