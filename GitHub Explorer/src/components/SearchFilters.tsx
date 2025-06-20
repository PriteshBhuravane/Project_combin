import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface SearchFiltersProps {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export const SearchFilters = ({
  selectedLanguage,
  setSelectedLanguage,
  sortBy,
  setSortBy,
}: SearchFiltersProps) => {
  const languages = [
    "all",
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "Go",
    "Rust",
    "PHP",
    "C#",
    "Ruby",
    "Swift",
    "Kotlin",
  ];

  const sortOptions = [
    { value: "stars", label: "Most Stars" },
    { value: "forks", label: "Most Forks" },
    { value: "updated", label: "Recently Updated" },
    { value: "created", label: "Newest" },
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Programming Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {languages.map((lang) => (
                  <SelectItem key={lang} value={lang} className="text-white hover:bg-slate-700">
                    {lang === "all" ? "All Languages" : lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">
              Sort By
            </label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-300 mb-2 block">
            Active Filters
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedLanguage !== "all" && (
              <Badge
                variant="secondary"
                className="bg-blue-500/20 text-blue-300 cursor-pointer hover:bg-blue-500/30"
                onClick={() => setSelectedLanguage("all")}
              >
                {selectedLanguage} ×
              </Badge>
            )}
            <Badge variant="secondary" className="bg-slate-700 text-slate-300">
              Sort: {sortOptions.find(opt => opt.value === sortBy)?.label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
