import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface ComponentListProps {
  components: string[];
}

const ComponentList: React.FC<ComponentListProps> = ({ components }) => {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-lg font-bold mb-4">Components</h2>
      {components.map((component) => (
        <DraggableComponent key={component} id={component}>
          {component}
        </DraggableComponent>
      ))}
    </div>
  );
};

const DraggableComponent: React.FC<{ id: string; children: React.ReactNode }> = ({ id, children }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...listeners} 
      {...attributes}
      className="mb-2 p-2 bg-white rounded shadow cursor-move"
    >
      {children}
    </div>
  );
};

export default ComponentList;
