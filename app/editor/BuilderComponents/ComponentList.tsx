import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ComponentListProps {
  components: string[];
}

const ComponentList: React.FC<ComponentListProps> = ({ components }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn(
      "transition-all duration-300 bg-gray-100 relative",
      isCollapsed ? "w-12" : "w-64"
    )}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-3 p-1 bg-white rounded-full shadow-md hover:bg-gray-50 z-10"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <PanelLeftOpen className="h-4 w-4" />
        ) : (
          <PanelLeftClose className="h-4 w-4" />
        )}
      </button>

      <div className={cn(
        "p-4 transition-opacity duration-300",
        isCollapsed ? "invisible" : "visible"
      )}>
        <h2 className="text-lg font-bold mb-4">Components</h2>
        {components.map((component) => (
          <DraggableComponent key={component} id={component}>
            {component}
          </DraggableComponent>
        ))}
      </div>
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
