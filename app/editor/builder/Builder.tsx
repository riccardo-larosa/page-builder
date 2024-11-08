'use client';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { notFound } from 'next/navigation';
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

import { Text, VerticalSpace, Heading, Hero, Button, CustomHtml, Component } from '../Components';
import ComponentList from '../BuilderComponents/ComponentList';
import Header from '../BuilderComponents/Header';
import BuilderArea from '../BuilderComponents/BuilderArea';
import PropertiesPanel from '../BuilderComponents/PropertiesPanel';
//import { ComponentType } from 'react';
import { ContentItem } from '@/app/api/content/route';

const components: { [key: string]: Component<any> } = {
  Hero,
  Heading,
  Text,
  VerticalSpace,
  Button,
  CustomHtml,
  // Add other components here as needed
};


interface EditorClientProps {
  contentItem: ContentItem;
}

export default function EditorClient( {contentItem}: EditorClientProps ) {
  const contentId = contentItem.content_id;

  if (!contentId) {
    notFound();
  }

  const [pageTitle, setPageTitle] = useState<string>(contentItem.name);
  const [builderComponents, setBuilderComponents] = useState<Array<{ type: string; props: any }>>([]);
  const [selectedComponent, setSelectedComponent] = useState<{ type: string; props: any } | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  useEffect(() => {
    if (contentItem.content) {
      setBuilderComponents(JSON.parse(contentItem.content));
    }
  }, [contentItem.content]);
  //setPageTitle(contentItem.name);


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


  async function generateHTML(builderComponents: { type: string; props: any; }[]) {
    const container = document.createElement('div');
    document.body.appendChild(container);
  
    const root = createRoot(container);
  
    // Generate unique IDs for each component
    const elements = builderComponents.map(({ type, props }, index) => {
      const componentConfig = components[type];
      if (!componentConfig) return null;
  
      const componentId = `component-${type}-${index}`;
      return React.createElement(componentConfig.reactComponent, {
        key: componentId,
        ...props
      });
    });
  
    root.render(React.createElement(React.Fragment, null, elements));
    // Wait for the components to render
    await new Promise(resolve => setTimeout(resolve, 0));
  
    // // Generate JavaScript for each component (if any)
    // const componentScripts = builderComponents.map(({ type, props }, index) => {
    //   // If the component is a button, add an event listener to it. 
    //   if (type === 'Button') {
    //     return `
    //               document.getElementById('${props.id}').addEventListener('click', function() {
    //                   const href = '${props.href}';
    //                   if (href) {
    //                       window.location.href = href;
    //                   }
    //               });
    //           `;
    //   }
    //   // Add other component types as needed
    //   return '';
    // }).filter(Boolean);
  
     let fullHtmlContent = container.innerHTML;
    // if (componentScripts.length > 0) {
    //   fullHtmlContent = `
    //       ${fullHtmlContent}
    //       <script>
    //         (function() {
    //             ${componentScripts.join('\n')}
    //         })();
    //     </script>`;
    // }
  
    // Clean up
    root.unmount();
    document.body.removeChild(container);
    return fullHtmlContent;
  }

  // Save the page data to the APIs
  const handleSave = async () => {
    const pageData = JSON.stringify(builderComponents);
    let fullHtmlContent = await generateHTML(builderComponents);

    console.log('Full HTML content:', fullHtmlContent);
    // Rest of your save logic...
    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        data: {
          type: "store_content_ext",
          id: contentItem.id,
          content_id: contentItem.content_id,
          content: pageData,
          html: fullHtmlContent,
          name: pageTitle,
        }
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save content');
    }

    const result = await response.json();
    console.log('Save result:', result);
  };

  return (
    <>
      <Header
        pageTitle={contentItem.name}
        setPageTitle={setPageTitle}
        onSave={handleSave}
      />
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
    </>
  );
}


