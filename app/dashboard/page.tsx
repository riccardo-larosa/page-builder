import React from 'react';
//import { fetchContentData } from '@/lib/api'; // Assume this function exists to fetch data
import ContentTable from '@/components/ContentTable'; // We'll create this component

export default async function ContentTablePage() {
  const contentData = await fetchContentData();

  async function fetchContentData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/content`);
    return response.json();
  };


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pages and Components</h1>
      <ContentTable data={contentData} />
    </div>
  );
}