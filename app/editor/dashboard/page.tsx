import React from 'react';
import ContentTable from '@/components/ContentTable'; // We'll create this component

export default async function DashboardPage() {
  const contentData = await fetchContentData();

  async function fetchContentData() {
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const response = await fetch(`${base_url}/api/content`, {
        cache: 'no-store',
      });
      if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
        return [];  // Return empty array as fallback
      }
      return response.json();
    } catch (error) {
      console.error('Fetch error:', error);
      return [];  // Return empty array as fallback
    }
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pages and Components</h1>
      <ContentTable data={contentData} />
    </div>
  );
}