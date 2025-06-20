import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RepoCard } from "./RepoCard";
import { Download, Share2, Trash2 } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string;
  updated_at: string;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface BookmarksPanelProps {
  bookmarks: Repository[];
  onRemoveBookmark: (id: number) => void;
  getLanguageColor: (language: string) => string;
}

export const BookmarksPanel = ({ bookmarks, onRemoveBookmark, getLanguageColor }: BookmarksPanelProps) => {
  const exportBookmarks = () => {
    const markdown = bookmarks
      .map(repo => `- [${repo.full_name}](${repo.html_url}) - ${repo.description || 'No description'}`)
      .join('\n');
    
    const blob = new Blob([`# My Bookmarked Repositories\n\n${markdown}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookmarked-repositories.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllBookmarks = () => {
    if (window.confirm('Are you sure you want to clear all bookmarks?')) {
      bookmarks.forEach(repo => onRemoveBookmark(repo.id));
    }
  };

  if (bookmarks.length === 0) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-12 text-center">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
            <p>Start bookmarking repositories to see them here!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bookmarks Header */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-white text-xl">
                My Bookmarks ({bookmarks.length})
              </CardTitle>
              <p className="text-slate-400 text-sm">
                Your saved repositories for easy access
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportBookmarks}
                className="border-slate-600 hover:border-green-500 hover:bg-green-500/10"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllBookmarks}
                className="border-slate-600 hover:border-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Bookmarked Repositories */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            isBookmarked={true}
            onBookmark={() => onRemoveBookmark(repo.id)}
            getLanguageColor={getLanguageColor}
          />
        ))}
      </div>

      {/* Stats */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-white font-semibold mb-4">Bookmark Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">
                {bookmarks.length}
              </p>
              <p className="text-sm text-slate-400">Total Bookmarks</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-400">
                {bookmarks.reduce((sum, repo) => sum + repo.stargazers_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Total Stars</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">
                {new Set(bookmarks.map(repo => repo.language).filter(Boolean)).size}
              </p>
              <p className="text-sm text-slate-400">Languages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-400">
                {bookmarks.reduce((sum, repo) => sum + repo.forks_count, 0).toLocaleString()}
              </p>
              <p className="text-sm text-slate-400">Total Forks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
