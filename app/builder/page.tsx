import { notFound } from 'next/navigation';
import BuilderClient from './BuilderClient';

async function fetchContentItem(contentId: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content?filter=eq(content_id,${contentId})`, {
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error('Failed to fetch content item');
  }

  const data = await response.json();
  return data.length > 0 ? data[0] : null;
}

export default async function BuilderPage({ searchParams }: { searchParams: { content_id?: string } }) {
  const contentId = searchParams.content_id;

  if (!contentId) {
    notFound();
  }

  const contentItem = await fetchContentItem(contentId);

  if (!contentItem) {
    notFound();
  }

  return <BuilderClient contentItem={contentItem} />;
}