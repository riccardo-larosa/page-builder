'use client';

import React, { useState, DragEvent, FocusEvent, useRef, useEffect, ChangeEvent } from 'react';
import { FaDesktop, FaTabletAlt, FaMobileAlt, FaTrash, FaSave, FaUpload, FaCog, FaCode, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';
import { MdTextFields, MdImage, MdSmartButton, MdViewColumn } from 'react-icons/md';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ContentItem } from '@/app/api/content/route';

type ComponentType = 'text' | 'image' | 'button' | 'columns';

interface Component {
  id: string;
  name: string;
  type: ComponentType;
  icon: React.ReactNode;
  styles: Record<string, string>;
  content: Record<string, string | Component[]>;
  textStyle?: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  textAlign?: 'left' | 'center' | 'right';
}

const initialComponents: Component[] = [
  {
    id: 'text',
    name: 'Text',
    type: 'text',
    icon: <MdTextFields />,
    styles: { fontSize: '16px', color: '#000000' },
    content: { text: 'Edit this text' },
    textStyle: 'normal',
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  {
    id: 'image',
    name: 'Image',
    type: 'image',
    icon: <MdImage />,
    styles: { width: '100%' },
    content: { src: '/images/sunset2.jpg', alt: 'Placeholder' }
  },
  {
    id: 'button',
    name: 'Button',
    type: 'button',
    icon: <MdSmartButton />,
    styles: { backgroundColor: '#3B82F6', color: 'white', padding: '8px 16px', borderRadius: '4px' },
    content: { text: 'Click me' }
  },
  {
    id: 'columns',
    name: 'Columns',
    type: 'columns',
    icon: <MdViewColumn />,
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

  
interface BuilderClientProps {
contentItem: ContentItem;
}

export default function Builder( {contentItem}: BuilderClientProps ) {
  console.log(contentItem);

  const [droppedComponents, setDroppedComponents] = useState<Component[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('desktop');
  const [activeSettings, setActiveSettings] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);


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
          if (comp.type === 'columns') {
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

  const handleContentChange = (id: string, newContent: Record<string, string>, parentId?: string) => {
    setDroppedComponents(components => {
      const updateComponent = (comp: Component): Component => {
        if (comp.id === id) {
          return { ...comp, content: { ...comp.content, ...newContent } };
        }
        if (comp.type === 'columns' && comp.content.children) {
          return {
            ...comp,
            content: {
              ...comp.content,
              children: (comp.content.children as Component[]).map(updateComponent)
            }
          };
        }
        return comp;
      };

      return components.map(updateComponent);
    });
  };

  const autoResize = (element: HTMLTextAreaElement | HTMLInputElement) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const loadPage = () => {
    if (contentItem.content) {
      try {
        const parsedContent = JSON.parse(contentItem.content);
        console.log(`parsedContent: ${parsedContent}`);
        if (Array.isArray(parsedContent)) {
          setDroppedComponents(parsedContent);
        } else {
          console.error('Invalid content format');
          toast.error('Failed to load page content. Invalid format.');
        }
      } catch (error) {
        console.error('Error parsing content:', error);
        toast.error('Failed to load page content. Please try again.');
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    Object.values(textareaRefs.current).forEach(ref => {
      if (ref) autoResize(ref);
    });
    Object.values(inputRefs.current).forEach(ref => {
      if (ref) autoResize(ref);
    });
    loadPage();
  }, [currentView ]);

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

  const handleTextStyleChange = (id: string, changes: Partial<Component>) => {
    setDroppedComponents(components => {
      const updateComponent = (comp: Component): Component => {
        if (comp.id === id) {
          return { ...comp, ...changes };
        }
        if (comp.type === 'columns' && comp.content.children) {
          return {
            ...comp,
            content: {
              ...comp.content,
              children: (comp.content.children as Component[]).map(updateComponent)
            }
          };
        }
        return comp;
      };

      return components.map(updateComponent);
    });
  };

  const handleColumnsChange = (id: string, newColumns: string) => {
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

  const ColumnsSettingsOverlay = ({ id, columns }: { id: string; columns: string }) => (
    <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg z-10">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Columns</label>
        <input
          type="number"
          min="1"
          max="4"
          value={columns}
          onChange={(e) => handleColumnsChange(id, e.target.value)}
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
          if (comp.type === 'columns') {
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

  const renderComponent = (component: Component, isInColumn: boolean = false) => {
    const ComponentWrapper = ({ children }: { children: React.ReactNode }) => (
      <div className={`relative group ${isInColumn ? 'w-full' : ''}`}>
        <div className="absolute top-0 right-0 p-1 bg-white rounded-bl hidden group-hover:flex space-x-2 z-10">
          <FaCog
            className="text-blue-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setActiveSettings(activeSettings === component.id ? null : component.id);
            }}
          />
          <FaTrash
            className="text-red-500 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(component.id);
            }}
          />
        </div>
        <div className={`border-2 border-transparent group-hover:border-blue-500 p-2 ${isInColumn ? 'h-full' : ''}`}>
          {children}
        </div>
        {activeSettings === component.id && (
          component.type === 'text' 
            ? <TextSettingsOverlay id={component.id} component={component} />
            : component.type === 'columns'
            ? <ColumnsSettingsOverlay id={component.id} columns={component.content.columns as string} />
            : null
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
      case 'text':
        const TextComponent = component.textStyle === 'normal' ? 'p' : component.textStyle;
        return (
          <ComponentWrapper key={component.id}>
            <TextComponent
              style={{
                ...component.styles,
                fontWeight: component.bold ? 'bold' : 'normal',
                fontStyle: component.italic ? 'italic' : 'normal',
                textDecoration: `${component.underline ? 'underline' : ''} ${component.strikethrough ? 'line-through' : ''}`.trim(),
                height: isInColumn ? '100%' : 'auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: component.textAlign === 'center' ? 'center' : 
                                component.textAlign === 'right' ? 'flex-end' : 'flex-start',
                textAlign: component.textAlign || 'left',
              }}
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleContentChange(component.id, { text: e.currentTarget.textContent || '' })}
              className="outline-none"
            >
              {component.content.text}
            </TextComponent>
          </ComponentWrapper>
        );
      case 'button':
        const Element = component.type === 'button' ? 'textarea' : 'input';
        return (
          <ComponentWrapper key={component.id}>
            <Element
              ref={inputRefs.current[component.id]}
              type={'text'}
              defaultValue={component.content.text}
              onBlur={handleBlur}
              onInput={handleInput}
              style={component.styles}
              className={`w-full bg-transparent overflow-hidden`}
              rows={undefined}
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
      case 'columns':
        const columnCount = parseInt(component.content.columns as string) || 2;
        return (
          <ComponentWrapper key={component.id}>
            <div 
              style={component.styles} 
              className={`min-h-[100px] h-full transition-colors duration-200 ${
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
              {Array.from({ length: columnCount }).map((_, index) => (
                <div key={index} className="h-full flex items-center justify-center">
                  {((component.content.children as Component[])[index]) ? 
                    renderComponent((component.content.children as Component[])[index], true) : 
                    <div className="text-gray-400 h-full w-full flex items-center justify-center">Drag components here</div>
                  }
                </div>
              ))}
            </div>
          </ComponentWrapper>
        );
    }
  };

  const TextSettingsOverlay = ({ id, component }: { id: string; component: Component }) => (
    <div className="absolute top-full left-0 mt-2 p-2 bg-white border border-gray-300 rounded shadow-lg z-10">
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Style</label>
        <select
          value={component.textStyle}
          onChange={(e) => handleTextStyleChange(id, { textStyle: e.target.value as Component['textStyle'] })}
          className="w-full p-1 border rounded"
        >
          <option value="normal">Normal</option>
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
          <option value="h4">H4</option>
          <option value="h5">H5</option>
          <option value="h6">H6</option>
        </select>
      </div>
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Font Size</label>
        <input
          type="number"
          value={parseInt(component.styles.fontSize)}
          onChange={(e) => handleTextStyleChange(id, { styles: { ...component.styles, fontSize: `${e.target.value}px` } })}
          className="w-full p-1 border rounded"
        />
      </div>
      <div className="mb-2">
        <label className="block text-sm font-bold mb-1">Color</label>
        <input
          type="color"
          value={component.styles.color}
          onChange={(e) => handleTextStyleChange(id, { styles: { ...component.styles, color: e.target.value } })}
          className="w-full p-1 border rounded"
        />
      </div>
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => handleTextStyleChange(id, { bold: !component.bold })}
          className={`p-1 border rounded ${component.bold ? 'bg-blue-500 text-white' : ''}`}
        >
          B
        </button>
        <button
          onClick={() => handleTextStyleChange(id, { italic: !component.italic })}
          className={`p-1 border rounded ${component.italic ? 'bg-blue-500 text-white' : ''}`}
        >
          I
        </button>
        <button
          onClick={() => handleTextStyleChange(id, { underline: !component.underline })}
          className={`p-1 border rounded ${component.underline ? 'bg-blue-500 text-white' : ''}`}
        >
          U
        </button>
        <button
          onClick={() => handleTextStyleChange(id, { strikethrough: !component.strikethrough })}
          className={`p-1 border rounded ${component.strikethrough ? 'bg-blue-500 text-white' : ''}`}
        >
          S
        </button>
      </div>
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => handleTextStyleChange(id, { textAlign: 'left' })}
          className={`p-1 border rounded ${component.textAlign === 'left' ? 'bg-blue-500 text-white' : ''}`}
        >
          <FaAlignLeft />
        </button>
        <button
          onClick={() => handleTextStyleChange(id, { textAlign: 'center' })}
          className={`p-1 border rounded ${component.textAlign === 'center' ? 'bg-blue-500 text-white' : ''}`}
        >
          <FaAlignCenter />
        </button>
        <button
          onClick={() => handleTextStyleChange(id, { textAlign: 'right' })}
          className={`p-1 border rounded ${component.textAlign === 'right' ? 'bg-blue-500 text-white' : ''}`}
        >
          <FaAlignRight />
        </button>
      </div>
    </div>
  );

  

  const savePage = async () => {
    const pageData = JSON.stringify(droppedComponents);
    const htmlContent = generateHTML(droppedComponents);
    localStorage.setItem('savedPage', pageData);
    localStorage.setItem('savedPageHTML', htmlContent);
    console.log(`pageData: ${pageData}`);
    console.log(`htmlContent: ${htmlContent}`);
    try {
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
              html: htmlContent,
            }
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save content');
        }
  
        const result = await response.json();
        console.log('Save result:', result);
  
        toast.success('Page saved successfully!', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error('Error saving page:', error);
        toast.error('Failed to save page. Please try again.', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    };

  const generateHTML = (components: Component[]): string => {
    const componentToHTML = (component: Component): string => {
      switch (component.type) {
        case 'text':
          const tag = component.textStyle === 'normal' ? 'p' : component.textStyle;
          const style = {
            ...component.styles,
            fontWeight: component.bold ? 'bold' : 'normal',
            fontStyle: component.italic ? 'italic' : 'normal',
            textDecoration: `${component.underline ? 'underline' : ''} ${component.strikethrough ? 'line-through' : 'none'}`.trim(),
            textAlign: component.textAlign || 'left',
          };
          return `<${tag} style="${styleObjectToString(style)}">${component.content.text}</${tag}>`;
        case 'button':
          return `<button style="${styleObjectToString(component.styles)}">${component.content.text}</button>`;
        case 'image':
          return `<img src="${component.content.src}" alt="${component.content.alt}" style="${styleObjectToString(component.styles)}" />`;
        case 'columns':
          const childrenHTML = (component.content.children as Component[]).map(componentToHTML).join('');
          return `<div style="${styleObjectToString(component.styles)}">${childrenHTML}</div>`;
        default:
          return '';
      }
    };

    const componentsHTML = components.map(componentToHTML).join('');
    return `<main style="padding: 200px 20px; display:block;">${componentsHTML}</main>`;
  };

  const styleObjectToString = (styles: Record<string, string>): string => {
    //return Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(' ');
    return Object.entries(styles)
    .map(([key, value]) => {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      // Handle numeric values
      const cssValue = typeof value === 'number' ? `${value}px` : value;
      return `${cssKey}: ${cssValue}`;
    })
    .join('; ');
  };


  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="w-1/3 text-lg font-semibold">{contentItem.name}</div> {/* Spacer */}
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
        <div className="w-1/3 flex justify-end space-x-4">
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
              className="bg-white border border-gray-300 p-2 mb-2 cursor-move flex items-center"
              draggable
              onDragStart={(e) => handleDragStart(e, component)}
            >
              <span className="mr-2 text-xl">{component.icon}</span>
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