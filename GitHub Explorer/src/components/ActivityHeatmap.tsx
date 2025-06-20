import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

interface Repository {
  id: number;
  name: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
}

interface ActivityHeatmapProps {
  repositories: Repository[];
}

export const ActivityHeatmap = ({ repositories }: ActivityHeatmapProps) => {
  // Generate mock activity data based on repository metrics
  const generateActivityData = () => {
    const days = 7;
    const hours = 24;
    const data = [];

    for (let day = 0; day < days; day++) {
      for (let hour = 0; hour < hours; hour++) {
        // Calculate activity level based on repository metrics
        const repoActivity = repositories.reduce((acc, repo) => {
          const daysSinceUpdate = Math.floor(
            (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24)
          );
          
          // Simulate activity patterns based on stars and recency
          let activity = 0;
          if (daysSinceUpdate <= 7) {
            activity += repo.stargazers_count / 1000;
          }
          if (daysSinceUpdate <= 1) {
            activity += repo.forks_count / 100;
          }
          
          // Add some randomness for demo purposes
          activity += Math.random() * 10;
          
          return acc + activity;
        }, 0);

        const intensity = Math.min(Math.floor(repoActivity / repositories.length), 4);
        
        data.push({
          day,
          hour,
          value: intensity,
          date: new Date(Date.now() - (6 - day) * 24 * 60 * 60 * 1000 + hour * 60 * 60 * 1000)
        });
      }
    }

    return data;
  };

  const activityData = generateActivityData();
  const maxValue = Math.max(...activityData.map(d => d.value));

  const getIntensityClass = (value: number) => {
    const intensity = maxValue > 0 ? value / maxValue : 0;
    if (intensity === 0) return "bg-slate-800";
    if (intensity <= 0.25) return "bg-blue-900/50";
    if (intensity <= 0.5) return "bg-blue-700/70";
    if (intensity <= 0.75) return "bg-blue-500/80";
    return "bg-blue-400";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hourLabels = ["12am", "6am", "12pm", "6pm"];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Repository Activity Heatmap</CardTitle>
        <p className="text-slate-400">Simulated activity patterns based on repository metrics</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Hour labels */}
              <div className="flex mb-2">
                <div className="w-12"></div>
                {Array.from({ length: 24 }, (_, hour) => (
                  <div key={hour} className="flex-1 min-w-4">
                    {hourLabels.includes(`${hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}${hour < 12 ? 'am' : 'pm'}`) && (
                      <span className="text-xs text-slate-400 block text-center">
                        {hour === 0 ? '12am' : hour > 12 ? `${hour - 12}pm` : hour === 12 ? '12pm' : `${hour}am`}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {Array.from({ length: 7 }, (_, day) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: day * 0.1 }}
                  className="flex items-center mb-1"
                >
                  <div className="w-12 text-xs text-slate-400 text-right pr-2">
                    {dayNames[day]}
                  </div>
                  {Array.from({ length: 24 }, (_, hour) => {
                    const dataPoint = activityData.find(d => d.day === day && d.hour === hour);
                    return (
                      <motion.div
                        key={`${day}-${hour}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: (day * 24 + hour) * 0.002 }}
                        className={`flex-1 min-w-4 h-4 mx-0.5 rounded-sm ${getIntensityClass(dataPoint?.value || 0)} 
                                  hover:ring-2 hover:ring-blue-400 cursor-pointer transition-all duration-200`}
                        title={`${dayNames[day]} ${hour}:00 - Activity: ${dataPoint?.value || 0}`}
                      />
                    );
                  })}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Less</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-slate-800 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-900/50 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-700/70 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-500/80 rounded-sm"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              </div>
              <span className="text-sm text-slate-400">More</span>
            </div>
            <div className="text-sm text-slate-400">
              Based on {repositories.length} repositories
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
