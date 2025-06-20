import { useState, useEffect } from "react";
import { Search, Star, GitFork, Eye, Calendar, ExternalLink, Bookmark, BookmarkCheck, Filter, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { RepoCard } from "@/components/RepoCard";
import { SearchFilters } from "@/components/SearchFilters";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { BookmarksPanel } from "@/components/BookmarksPanel";
import { useGitHubAPI } from "@/hooks/useGitHubAPI";
import { useBookmarks } from "@/hooks/useBookmarks";
const Index = () => {
  const [searchQuery, setSearchQuery] = useState("react");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [sortBy, setSortBy] = useState("stars");
  const [showFilters, setShowFilters] = useState(false);

  const { repositories, loading, searchRepositories, trending } = useGitHubAPI();
  const { bookmarks, addBookmark, removeBookmark, isBookmarked } = useBookmarks();

  useEffect(() => {
    searchRepositories(searchQuery, selectedLanguage, sortBy);
  }, [searchQuery, selectedLanguage, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchRepositories(searchQuery, selectedLanguage, sortBy);
  };

  // Create a search function for the comparison tool
  const handleRepoSearch = async (query: string) => {
    return new Promise<any[]>((resolve) => {
      // Simulate API call with existing search logic
      setTimeout(async () => {
        try {
          const searchParams = {
            q: `${query} stars:>10`,
            sort: "stars",
            order: "desc",
            per_page: 10,
          };
          const params = new URLSearchParams(searchParams as any);
          const response = await fetch(`https://api.github.com/search/repositories?${params}`);
          const data = await response.json();
          resolve(data.items || []);
        } catch (error) {
          console.error("Search error:", error);
          resolve([]);
        }
      }, 500);
    });
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      PHP: "bg-indigo-500",
    };
    return colors[language] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              GitHub Explorer
            </h1>
            <p className="text-slate-400">
              Discover, bookmark, and analyze open source projects
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="border-slate-600 hover:border-slate-500"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-400"
                  />
                </div>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <SearchFilters
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Tabs defaultValue="explore" className="space-y-6">
            <TabsList className=" bg-white border-slate-700">
              <TabsTrigger value="explore" className="data-[state=active]:bg-slate-200">
                Explore
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="data-[state=active]:bg-slate-200">
                Bookmarks ({bookmarks.length})
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-200">
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="explore" className="space-y-6">
              {/* Trending Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="h-6 w-6 mr-2 text-orange-500" />
                  Trending Today
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                  {trending.slice(0, 3).map((repo, index) => (
                    <motion.div
                      key={repo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <RepoCard
                        repo={repo}
                        isBookmarked={isBookmarked(repo.id)}
                        onBookmark={() =>
                          isBookmarked(repo.id)
                            ? removeBookmark(repo.id)
                            : addBookmark(repo)
                        }
                        getLanguageColor={getLanguageColor}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Search Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <h2 className="text-2xl font-semibold text-white mb-4">
                  Search Results
                </h2>
                {loading ? (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card className="bg-slate-800/50 border-slate-700">
                          <CardContent className="p-6">
                            <div className="animate-pulse space-y-4">
                              <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                              <div className="h-3 bg-slate-700 rounded w-full"></div>
                              <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {repositories.map((repo, index) => (
                      <motion.div
                        key={repo.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <RepoCard
                          repo={repo}
                          isBookmarked={isBookmarked(repo.id)}
                          onBookmark={() =>
                            isBookmarked(repo.id)
                              ? removeBookmark(repo.id)
                              : addBookmark(repo)
                          }
                          getLanguageColor={getLanguageColor}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            <TabsContent value="bookmarks">
              <BookmarksPanel
                bookmarks={bookmarks}
                onRemoveBookmark={removeBookmark}
                getLanguageColor={getLanguageColor}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsChart 
                repositories={repositories} 
                bookmarks={bookmarks} 
                onSearchRepo={handleRepoSearch}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
