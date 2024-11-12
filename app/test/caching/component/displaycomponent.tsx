import { ComponentMap } from '@/app/editor/Components';

async function getContent(contentId: string) {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    const response = await fetch(`${base_url}/api/content?filter=eq(content_id,${contentId})`, {
        next: { revalidate: 0 }, // Disable cache
    });

    if (!response.ok) {
        throw new Error('Failed to fetch content');
    }

    return response.json();
}

export default async function DisplayComponent({ content_id }: { content_id: string }) {
    const content = await getContent(content_id);
    const components = JSON.parse(content[0].content);
    return (
        <div className="container mx-auto">
            {components.map((componentData: any, index: number) => {
                const componentConfig = ComponentMap[componentData.type as keyof typeof ComponentMap];
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
    )

}