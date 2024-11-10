import { DashboardClient } from './client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const contentData = await fetchContentData();

  async function fetchContentData() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const response = await fetch(`${base_url}/api/content`, { cache: 'no-store' });
      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        return [];
      }
      //console.log('response', await response.json());
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];
    }
  };

  //console.log('contentData', contentData);

  return <DashboardClient initialData={contentData} />;
}