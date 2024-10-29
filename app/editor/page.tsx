'use client';
import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragMoveEvent,
  useSensor,
  useSensors,
  PointerSensor,
  MouseSensor,
  TouchSensor
} from '@dnd-kit/core';

import { Text, VerticalSpace, Heading, Hero, Button, Component } from './Components';
import ComponentList from './ComponentList';
import BuilderArea from './BuilderArea';
import PropertiesPanel from './PropertiesPanel';
import { ComponentType } from 'react';

const components: { [key: string]: Component<any> } = {
  Heading,
  Text,
  VerticalSpace,
  Button,
  Hero,
  // Add other components here as needed
};

export default function EditorPage() {
  const [builderComponents, setBuilderComponents] = useState<Array<{ type: string; props: any }>>([]);
  const [selectedComponent, setSelectedComponent] = useState<{ type: string; props: any } | null>(null);

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    //console.log('Drag start:', event);
    setActiveId(event.active.id as string);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    //console.log('Drag move:', event);
    //console.log('Over:', event.over);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    //console.log('Drag end:', event);
    const { active, over } = event;
    
    if (active && over && over.id === 'builder-area') {
      const newComponentType = active.id as string;
      const componentConfig = components[newComponentType];
      if (componentConfig) {
        const newComponent = {
          type: newComponentType,
          props: { 
            id: Date.now().toString(),
            ...componentConfig.defaultProps 
          }
        };
        setBuilderComponents(prevComponents => {
          const newComponents = [...prevComponents, newComponent];
          //console.log('Updated builderComponents:', newComponents);
          return newComponents;
        });
        //console.log('New component added:', newComponent);
      }
    } else {
      console.log('Dropped outside builder area:', over ? over.id : 'no over target');
    }
    setActiveId(null);
  };

  const handleUpdateComponent = (updatedProps: any) => {
    if (selectedComponent) {
      const updatedComponents = builderComponents.map((component) =>
        component.props.id === selectedComponent.props.id
          ? { ...component, props: updatedProps }
          : component
      );
      setBuilderComponents(updatedComponents);
      setSelectedComponent({ ...selectedComponent, props: updatedProps });
    }
  };


  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragMove={handleDragMove} onDragEnd={handleDragEnd}>
      <div className="flex">
        <ComponentList components={Object.keys(components)} />
        <BuilderArea
          components={builderComponents}
          componentMap={components}
          onSelectComponent={setSelectedComponent}
          onComponentsChange={setBuilderComponents}
        />
        <PropertiesPanel
          selectedComponent={selectedComponent}
          componentMap={components}
          onUpdateComponent={handleUpdateComponent}
        />
      </div>
      <DragOverlay>
        {activeId ? <div>{activeId}</div> : null}
      </DragOverlay>
    </DndContext>
  );
}
