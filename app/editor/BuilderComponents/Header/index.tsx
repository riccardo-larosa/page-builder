import React from 'react';
// import styles from './styles.module.css';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import ContentVersions from '../ContentVersions';
import EpIcon from '@/components/icons/ep-icon';
import EpLogo from '@/components/icons/ep-logo';

interface HeaderProps {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  onSave: () => void;
  contentId: string;
}
export default function Header({ pageTitle, setPageTitle, onSave, contentId }: HeaderProps) {
  return (
    <header>
      <div className="grid grid-cols-5 items-center w-full justify-between gap-8 px-4 mx-auto my-1 pr-2">
        <div>
          <a href="/editor/dashboard" className="text-gray-600 hover:text-gray-800">← Dashboard</a> 
        </div>
        <div className="col-span-3 flex justify-center items-center gap-4">
          <input
            type="url"
            className="border border-gray-300 rounded-md p-2 w-64 max-w-md"
            defaultValue={pageTitle || ''}
            onChange={(e) => setPageTitle(e.target.value)}
          />
          <button
            onClick={onSave}
            className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="p-2 h-10" title="History">
                History <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Version History</DialogTitle>
                <DialogDescription>
                  View and restore previous versions of your content.
                </DialogDescription>
              </DialogHeader>
              <ContentVersions contentId={contentId} />
            </DialogContent>
          </Dialog>

        </div>
        <div className="flex justify-center">
          <EpLogo className="w-28" />
        </div>
      </div>
    </header>
  );
};
