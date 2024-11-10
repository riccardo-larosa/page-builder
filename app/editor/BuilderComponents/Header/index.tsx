import React from 'react';
import styles from './styles.module.css';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ContentVersions from '../ContentVersions';

interface HeaderProps {
  pageTitle: string;
  setPageTitle: (title: string) => void;
  onSave: () => void;
  contentId: string;
}
export default function Header({ pageTitle, setPageTitle, onSave, contentId }: HeaderProps) {
  console.log('contentId', contentId);
  return (
    <header>
      <div className={styles.tools}>
        <div className="flex items-center gap-4">
          <a 
            href="/editor/dashboard"
            className="text-gray-600 hover:text-gray-800"
          >
            ← Dashboard
          </a>
          <input
            type="url"
            className={styles.urlInput}
            defaultValue={pageTitle || ''}
            onChange={(e) => setPageTitle(e.target.value)}
          />
        </div>
        <div className={styles.toolsContainer}>
          <button
            onClick={onSave}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Save
          </button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className={styles.iconButton} title="History">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 8v4l3 3" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Version History</DialogTitle>
              </DialogHeader>
              <ContentVersions contentId={contentId} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};
