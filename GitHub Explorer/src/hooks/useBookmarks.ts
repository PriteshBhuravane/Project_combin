import { useState, useEffect } from "react";
import { Repository } from "./types"; 
const STORAGE_KEY = "github-explorer-bookmarks";

interface BookmarksHook {
  bookmarks: Repository[];
  addBookmark: (repository: Repository) => void;
  removeBookmark: (repositoryId: number) => void;
  isBookmarked: (repositoryId: number) => boolean;
  clearAllBookmarks: () => void;
  getBookmarkCount: () => number;
}

export const useBookmarks = (): BookmarksHook => {
  const [bookmarks, setBookmarks] = useState<Repository[]>([]);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    const loadBookmarks = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setBookmarks(parsed);
          }
        }
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        setBookmarks([]);
      }
    };

    loadBookmarks();
  }, []);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    const saveBookmarks = () => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
      } catch (error) {
        console.error("Error saving bookmarks:", error);
      }
    };

    saveBookmarks();
  }, [bookmarks]);

  const addBookmark = (repository: Repository) => {
    setBookmarks((prev) => {
      const exists = prev.some((bookmark) => bookmark.id === repository.id);
      return exists ? prev : [...prev, repository];
    });
  };

  const removeBookmark = (repositoryId: number) => {
    setBookmarks((prev) => prev.filter((bookmark) => bookmark.id !== repositoryId));
  };

  const isBookmarked = (repositoryId: number): boolean => {
    return bookmarks.some((bookmark) => bookmark.id === repositoryId);
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
  };

  const getBookmarkCount = (): number => {
    return bookmarks.length;
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearAllBookmarks,
    getBookmarkCount,
  };
};