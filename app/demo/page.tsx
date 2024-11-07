import { Text, VerticalSpace, Heading, Hero, Button, CustomHtml } from '../editor/Components';
// Convert to async server component
export default async function DemoPage() {
  const componentMap = {
    Text,
    VerticalSpace,
    Heading,
    Hero,
    Button,
    CustomHtml
  };

  // Server-side data fetching
  let components = [];
  try {
    const response = await fetch('http://localhost:3000/api/content?filter=like(content_id,this_test)', {
      cache: 'no-store' // or { next: { revalidate: 60 } } for ISR
    });
    if (!response.ok) throw new Error('Failed to load page');
    
    const data = await response.json();
    if (data[0]?.content) {
      components = JSON.parse(data[0].content);
    }
  } catch (error) {
    console.error('Error:', error);
    return <div>Error loading page</div>;
  }

  return (
    <div className="container mx-auto">
      {components.map((componentData: any, index: number) => {
        const componentConfig = componentMap[componentData.type];
        const ComponentToRender = componentConfig.reactComponent;
        
        if (!ComponentToRender) {
          console.warn(`No component found for type: ${componentData.type}`);
          return null;
        }

        return (
          <div key={index}>
            <ComponentToRender {...componentData.props} />
          </div>
        );
      })}
    </div>
  );
}
