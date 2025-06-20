import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Star, GitFork, Eye, Calendar, Users, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  created_at: string;
  open_issues_count: number;
  size: number;
  topics: string[];
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface RepoComparisonProps {
  onSearchRepo: (query: string) => Promise<Repository[]>;
}

export const RepoComparison = ({ onSearchRepo }: RepoComparisonProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Repository[]>([]);
  const [selectedRepos, setSelectedRepos] = useState<Repository[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await onSearchRepo(searchQuery);
      setSearchResults(results.slice(0, 10));
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addToComparison = (repo: Repository) => {
    if (selectedRepos.length >= 3) return;
    if (selectedRepos.some(r => r.id === repo.id)) return;
    
    setSelectedRepos(prev => [...prev, repo]);
  };

  const removeFromComparison = (repoId: number) => {
    setSelectedRepos(prev => prev.filter(r => r.id !== repoId));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSize = (size: number) => {
    return `${(size / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Repository Comparison Tool</CardTitle>
          <p className="text-slate-400">Compare up to 3 repositories side by side</p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search repositories to compare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
              <Search className="h-4 w-4 mr-2" />
              {isSearching ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2 max-h-60 overflow-y-auto"
              >
                {searchResults.map((repo) => (
                  <motion.div
                    key={repo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{repo.full_name}</h4>
                      <p className="text-slate-400 text-sm truncate">{repo.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToComparison(repo)}
                      disabled={selectedRepos.length >= 3 || selectedRepos.some(r => r.id === repo.id)}
                    >
                      Add
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Comparison Table */}
      {selectedRepos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Repository Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <td className="text-slate-400 font-medium p-3">Metric</td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="text-slate-400 font-medium p-3">
                          <div className="flex items-center justify-between">
                            <span className="truncate">{repo.name}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromComparison(repo.id)}
                              className="ml-2 text-red-400 hover:text-red-300"
                            >
                              ×
                            </Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 mr-2 text-yellow-400" />
                          Stars
                        </div>
                      </td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {repo.stargazers_count.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">
                        <div className="flex items-center">
                          <GitFork className="h-4 w-4 mr-2 text-blue-400" />
                          Forks
                        </div>
                      </td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {repo.forks_count.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-2 text-green-400" />
                          Watchers
                        </div>
                      </td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {repo.watchers_count.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">
                        <div className="flex items-center">
                          <AlertCircle className="h-4 w-4 mr-2 text-red-400" />
                          Open Issues
                        </div>
                      </td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {repo.open_issues_count.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">Language</td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3">
                          <Badge variant="secondary" className="bg-slate-600 text-slate-200">
                            {repo.language || "N/A"}
                          </Badge>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                          Created
                        </div>
                      </td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {formatDate(repo.created_at)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">Last Updated</td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {formatDate(repo.updated_at)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="p-3 text-white font-medium">Size</td>
                      {selectedRepos.map((repo) => (
                        <td key={repo.id} className="p-3 text-slate-300">
                          {formatSize(repo.size)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
