import React from 'react';
import styles from './styles.module.css';

export default function Header() {
    return <header>
       
        <div className={styles.tools}>
            <div>
            <input 
                type="url"
                placeholder="Enter URL..."
                className={styles.urlInput}
                />
            </div>
            <div className={styles.toolsContainer}>
                <button
              className={styles.publishButton}
            >
              Publish
            </button>
            <button className={styles.iconButton} title="Undo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v6h6" />
                <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
              </svg>
            </button>
            <button className={styles.iconButton} title="Redo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 7v6h-6" />
                <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" />
              </svg>
            </button>
          </div>
        </div>
    </header>;
};