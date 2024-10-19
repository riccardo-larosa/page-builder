import React from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export const SortableItem: React.FC<SortableItemProps> = ({id, children, onClick}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  console.log(children);
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      onClick={onClick}
      className="mb-4"
    >
      {children}
    </div>
  );
}
