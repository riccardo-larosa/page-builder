import DisplayComponent from './component/displaycomponent';

export default async function TestCachingPage({ searchParams, }: { searchParams: { content_id?: string }; }) {
    if (!searchParams.content_id) {
        return <div>Please provide a content_id in the URL</div>;
    }
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Content Details</h1>
            <DisplayComponent content_id={searchParams.content_id} />
            do other stuff here
        </div>
    );

}