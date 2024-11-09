'use client';
import { useState } from 'react';
import ContentTable from './ContentTable';

interface CreatePageData {
  content_id: string;
  name: string;
}

function CreateOverlay({ onClose, onSubmit }: { 
  onClose: () => void, 
  onSubmit: (data: CreatePageData) => Promise<void> 
}) {
  const [content_id, setContentId] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content_id || !name) {
      setError('Both fields are required');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSubmit({ content_id, name });
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Create New Page</h2>
        {error && <div className="mb-4 text-red-500">{error}</div>}
        <input
          type="text"
          placeholder="Content ID"
          className="w-full mb-3 p-2 border rounded"
          value={content_id}
          onChange={(e) => setContentId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function DashboardClient({ initialData }) {
  const [showCreate, setShowCreate] = useState(false);
  const [data, setData] = useState(initialData);

  const handleCreate = async (formData: CreatePageData) => {
    const response = await fetch('/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create page');
    }

    // Refresh the data
    const newData = await fetch('/api/content').then(res => res.json());
    setData(newData);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pages and Components here</h1>
        <button 
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create New
        </button>
      </div>
      {showCreate && (
        <CreateOverlay 
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
      <ContentTable data={data} />
    </div>
  );
} 