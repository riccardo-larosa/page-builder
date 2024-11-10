import React, { useState } from 'react';
import { formatDateAndTime } from '@/lib/utils';
import Link from 'next/link';
import { ContentItem } from '@/app/api/content/route';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

interface ContentTableProps {
  items: ContentItem[];
  onRefresh: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ items, onRefresh }) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  console.log('data', items);
  const onDelete = async (contentId: string) => {
    try {
      setDeletingId(contentId);
      const response = await fetch(`/api/content?content_id=${contentId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete content');
      }

      toast({
        title: "Success",
        description: "Content deleted successfully",
      });

      // Refresh the data
      onRefresh();

    } catch (error) {
      console.error('Error deleting content:', error);
      toast({
        title: "Error",
        description: "Failed to delete content",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr className="">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Content ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Modified At</th>
            {/* Add more table headers as needed */}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <Link 
                    //href={`/builder?content_id=${item.content_id}`}
                    href={`/editor/builder?content_id=${item.content_id}`}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                  >
                    {item.content_id}
                </Link>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{item.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{(item.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">{(formatDateAndTime(item.last_modified_at))}</td>
              {/* Add more table cells as needed */}
              <td>
                <button
                  onClick={() => onDelete(item.content_id)}
                  className="p-2 hover:text-red-600 transition-colors disabled:opacity-50"
                  disabled={deletingId === item.content_id}
                >
                  {deletingId === item.content_id ? (
                    <Spinner className="h-4 w-4" />
                  ) : (
                    <TrashIcon className="h-4 w-4" />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContentTable;