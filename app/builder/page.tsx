'use client';

import React, { useState, DragEvent, FocusEvent, useRef, useEffect, ChangeEvent } from 'react';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaTrash, FaSave, FaUpload, FaCog } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type ComponentType = 'header' | 'paragraph' | 'image' | 'button' | 'layout';

interface Component {
  id: string;
  name: string;
  type: ComponentType;
  styles: Record<string, string>;
  content: Record<string, string | Component[]>;
}

const initialComponents: Component[] = [
  {
    id: 'header',
    name: 'Header',
    type: 'header',
    styles: { fontSize: '24px', fontWeight: 'bold' },
    content: { text: 'Header' }
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    type: 'paragraph',
    styles: { fontSize: '16px' },
    content: { text: 'This is a paragraph.' }
  },
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    styles: { width: '100%' },
    content: { src: 'https://via.placeholder.com/150', alt: 'Placeholder' }
  },
  {
    id: 'button',
    name: 'Button',
    type: 'button',
    styles: { backgroundColor: '#3B82F6', color: 'white', padding: '8px 16px', borderRadius: '4px' },
    content: { text: 'Click me' }
  },
  {
    id: 'layout',
    name: 'Layout',
    type: 'layout',
    styles: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' },
    content: { columns: '2', children: [] }
  }
];

type ViewType = 'desktop' | 'tablet' | 'mobile';

interface TextSettings {
  fontSize: string;
  color: string;
  fontWeight: string;
}

export default function Builder() {
  const [droppedComponents, setDroppedComponents] = useState<Component[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('desktop');
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);


  // Create refs for each dropped component
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleDragStart = (e: DragEvent<HTMLDivElement>, component: Component) => {
    e.dataTransfer.setData('application/json', JSON.stringify(component));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, id?: string) => {
    e.preventDefault();
    if (id) {
      setDraggedOver(id);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggedOver(null);
  };



  const handleDelete = (id: string) => {
    setDroppedComponents(components => {
      const deleteComponent = (comps: Component[]): Component[] => {
        return comps.reduce((acc, comp) => {
          if (comp.id === id) {
            return acc;
          }
          if (comp.type === 'layout') {
            return [...acc, {
              ...comp,
              content: {
                ...comp.content,
                children: deleteComponent(comp.content.children as Component[])
              }
            }];
          }
          return [...acc, comp];
        }, [] as Component[]);
      };
      return deleteComponent(components);
    });
  };

  const handleContentChange = (id: string, newContent: Record<string, string>) => {
    setDroppedComponents(components =>
      components.map(component =>
        component.id === id ? { ...component, content: newContent } : component
      )
    );
  };

  const autoResize = (element: HTMLTextAreaElement | HTMLInputElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  useEffect(() => {
    Object.values(textareaRefs.current).forEach(ref => {
      if (ref) autoResize(ref);
    });
    Object.values(inputRefs.current).forEach(ref => {
      if (ref) autoResize(ref);
    });
  }, [droppedComponents, currentView]);

  const handleImageUpload = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        handleContentChange(id, { ...droppedComponents.find(c => c.id === id)?.content, src: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStyleChange = (id: string, newStyles: Partial<TextSettings>) => {
    setDroppedComponents(components =>
      components.map(component =>
        component.id === id ? { ...component, styles: { ...component.styles, ...newStyles } } : component
      )
    );
  };

  const TextSettingsOverlay = ({ id, styles }: { id: string; styles: TextSettings }) => (
    <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg z-10">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Font Size</label>
        <input
          type="number"
          value={parseInt(styles.fontSize)}
          onChange={(e) => handleStyleChange(id, { fontSize: `${e.target.value}px` })}
          className="w-full p-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Color</label>
        <input
          type="color"
          value={styles.color}
          onChange={(e) => handleStyleChange(id, { color: e.target.value })}
          className="w-full p-1 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-bold mb-1">Font Weight</label>
        <select
          value={styles.fontWeight}
          onChange={(e) => handleStyleChange(id, { fontWeight: e.target.value })}
          className="w-full p-1 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
        </select>
      </div>
    </div>
  );

  const handleLayoutChange = (id: string, newColumns: string) => {
    setDroppedComponents(components =>
      components.map(component =>
        component.id === id
          ? {
              ...component,
              styles: { ...component.styles, gridTemplateColumns: `repeat(${newColumns}, 1fr)` },
              content: { ...component.content, columns: newColumns }
            }
          : component
      )
    );
  };

  const LayoutSettingsOverlay = ({ id, columns }: { id: string; columns: string }) => (
    <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg z-10">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Columns</label>
        <input
          type="number"
          min="1"
          max="4"
          value={columns}
          onChange={(e) => handleLayoutChange(id, e.target.value)}
          className="w-full p-1 border rounded"
        />
      </div>
    </div>
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetId?: string) => {
    e.preventDefault();
    setDraggedOver(null);
    const componentData = e.dataTransfer.getData('application/json');
    const component: Component = JSON.parse(componentData);
    const newComponent = { ...component, id: Math.random().toString(36).substr(2, 9) };
    
    setDroppedComponents(components => {
      const updateChildren = (comps: Component[]): Component[] => {
        return comps.map(comp => {
          if (comp.id === targetId) {
            return {
              ...comp,
              content: {
                ...comp.content,
                children: [...(comp.content.children as Component[]), newComponent]
              }
            };
          }
          if (comp.type === 'layout') {
            return {
              ...comp,
              content: {
                ...comp.content,
                children: updateChildren(comp.content.children as Component[])
              }
            };
          }
          return comp;
        });
      };

      return targetId ? updateChildren(components) : [...components, newComponent];
    });
  };

  const renderComponent = (component: Component) => {
    const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className="relative group">
        <div className="absolute top-0 right-0 p-1 bg-white rounded-bl hidden group-hover:flex space-x-2">
          <FaCog
            className="text-blue-500 cursor-pointer"
            onClick={() => setActiveSettings(activeSettings === component.id ? null : component.id)}
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            onClick={() => handleDelete(component.id)}
          />
        </div>
        <div className="border-2 border-transparent group-hover:border-blue-500 p-2">
          {children}
        </div>
        {activeSettings === component.id && (
          component.type === 'layout' 
            ? <LayoutSettingsOverlay id={component.id} columns={component.content.columns as string} />
            : ['header', 'paragraph', 'button'].includes(component.type) && (
                <TextSettingsOverlay id={component.id} styles={component.styles as TextSettings} />
              )
        )}
      </div>
    );

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleContentChange(component.id, { ...component.content, text: e.target.value });
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const target = e.target as HTMLTextAreaElement | HTMLInputElement;
      autoResize(target);
    };

    switch (component.type) {
      case 'header':
      case 'paragraph':
      case 'button':
        const Element = component.type === 'paragraph' ? 'textarea' : 'input';
        return (
          <ComponentWrapper key={component.id}>
            <Element
              ref={el => {
                (component.type === 'paragraph' ? textareaRefs : inputRefs).current[component.id] = el;
                if (el) autoResize(el);
              }}
              type={component.type === 'button' ? 'text' : undefined}
              defaultValue={typeof component.content.text === 'string' ? component.content.text : ''}
              onBlur={handleBlur}
              onInput={handleInput}
              style={component.styles}
              className={`w-full bg-transparent ${component.type === 'paragraph' ? 'resize-none' : ''} overflow-hidden`}
              rows={component.type === 'paragraph' ? 1 : undefined}
            />
          </ComponentWrapper>
        );
      case 'image':
        return (
          <ComponentWrapper key={component.id}>
            <div className="relative">
              <img 
                src={component.content.src} 
                alt={component.content.alt} 
                style={component.styles}
                className="w-full"
              />
              <label 
                htmlFor={`image-upload-${component.id}`} 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200"
              >
                <FaUpload className="text-white text-4xl" />
              </label>
              <input
                id={`image-upload-${component.id}`}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(component.id, e)}
                className="hidden"
              />
            </div>
          </ComponentWrapper>
        );
      case 'layout':
        return (
          <ComponentWrapper key={component.id}>
            <div 
              style={component.styles} 
              className={`grid min-h-[100px] transition-colors duration-200 ${
                draggedOver === component.id 
                  ? 'border-2 border-blue-500 bg-blue-100' 
                  : 'border-2 border-dashed border-gray-300'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragOver(e, component.id);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDragLeave(e);
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDrop(e, component.id);
              }}
            >
              {(component.content.children as Component[]).map(renderComponent)}
              {(component.content.children as Component[]).length === 0 && (
                <div className="col-span-full h-full flex items-center justify-center text-gray-400">
                  Drag components here
                </div>
              )}
            </div>
          </ComponentWrapper>
        );
    }
  };

  

  const savePage = () => {
    const pageData = JSON.stringify(droppedComponents);
    localStorage.setItem('savedPage', pageData);
    console.log(pageData);
    toast.success('Page saved successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="w-1/3"></div> {/* Spacer */}
        <div className="flex justify-center space-x-4 w-1/3">
          <FaDesktop
            className={`cursor-pointer ${currentView === 'desktop' ? 'text-blue-500' : ''}`}
            onClick={() => setCurrentView('desktop')}
          />
          <FaTabletAlt
            className={`cursor-pointer ${currentView === 'tablet' ? 'text-blue-500' : ''}`}
            onClick={() => setCurrentView('tablet')}
          />
          <FaMobileAlt
            className={`cursor-pointer ${currentView === 'mobile' ? 'text-blue-500' : ''}`}
            onClick={() => setCurrentView('mobile')}
          />
        </div>
        <div className="w-1/3 flex justify-end">
          <button
            onClick={savePage}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <FaSave className="mr-2" /> Save
          </button>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Components</h2>
          {initialComponents.map((component) => (
            <div
              key={component.id}
              className="bg-white border border-gray-300 p-2 mb-2 cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
            >
              {component.name}
            </div>
          ))}
        </aside>
        <main
          className={`flex-1 p-4 overflow-y-auto transition-colors duration-200 ${
            currentView === 'desktop' ? 'w-full' :
            currentView === 'tablet' ? 'max-w-2xl mx-auto border border-gray-300' :
            'max-w-sm mx-auto border border-gray-300'
          } ${draggedOver === 'main' ? 'bg-blue-100' : ''}`}
          onDragOver={(e) => handleDragOver(e, 'main')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e)}
        >
          {droppedComponents.map(renderComponent)}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}