import { Star, GitFork, Eye, Calendar, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

interface RepoCardProps {
  repo: Repository;
  isBookmarked: boolean;
  onBookmark: () => void;
  getLanguageColor: (language: string) => string;
}

export const RepoCard = ({ repo, isBookmarked, onBookmark, getLanguageColor }: RepoCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={repo.owner.avatar_url}
              alt={repo.owner.login}
              className="w-8 h-8 rounded-full ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all"
            />
            <div>
              <CardTitle className="text-white text-lg leading-tight">
                {repo.name}
              </CardTitle>
              <p className="text-slate-400 text-sm">{repo.owner.login}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookmark}
            className="hover:bg-slate-700 transition-colors"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-yellow-500" />
            ) : (
              <Bookmark className="h-4 w-4 text-slate-400 hover:text-yellow-500" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {repo.description || "No description available"}
        </p>

        {/* Topics */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <Badge
                key={topic}
                variant="secondary"
                className="bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 text-xs"
              >
                {topic}
              </Badge>
            ))}
            {repo.topics.length > 3 && (
              <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">
                +{repo.topics.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{formatNumber(repo.stargazers_count)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <GitFork className="h-4 w-4 text-blue-400" />
              <span>{formatNumber(repo.forks_count)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-4 w-4 text-green-400" />
              <span>{formatNumber(repo.watchers_count)}</span>
            </div>
          </div>
        </div>

        {/* Language and Date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {repo.language && (
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></div>
                <span className="text-slate-300 text-sm">{repo.language}</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-xs">
            <Calendar className="h-3 w-3" />
            <span>{formatDate(repo.updated_at)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-slate-700">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-slate-600 hover:border-blue-500 hover:bg-blue-500/10 transition-all group"
            onClick={() => window.open(repo.html_url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2 group-hover:text-blue-400" />
            View on GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
