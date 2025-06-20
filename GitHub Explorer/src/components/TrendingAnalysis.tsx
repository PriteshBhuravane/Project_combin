import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
}

interface TrendingAnalysisProps {
  repositories: Repository[];
}

export const TrendingAnalysis = ({ repositories }: TrendingAnalysisProps) => {
  // Generate mock trending data for the past 30 days
  const generateTrendingData = () => {
    const days = 30;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Calculate simulated growth based on repository age and popularity
      const totalStars = repositories.reduce((sum, repo) => {
        const repoAge = Math.floor((Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const growthFactor = Math.max(0.1, 1 - (repoAge / 365)); // Newer repos grow faster
        const baseGrowth = repo.stargazers_count * growthFactor * 0.001;
        
        // Add some randomness
        const randomGrowth = (Math.random() - 0.5) * baseGrowth * 0.5;
        return sum + Math.max(0, baseGrowth + randomGrowth);
      }, 0);

      const totalForks = repositories.reduce((sum, repo) => {
        const repoAge = Math.floor((Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const growthFactor = Math.max(0.1, 1 - (repoAge / 365));
        const baseGrowth = repo.forks_count * growthFactor * 0.001;
        const randomGrowth = (Math.random() - 0.5) * baseGrowth * 0.3;
        return sum + Math.max(0, baseGrowth + randomGrowth);
      }, 0);

      data.push({
        date: date.toISOString().split('T')[0],
        stars: Math.floor(totalStars),
        forks: Math.floor(totalForks),
        activity: Math.floor(Math.random() * 50 + 10)
      });
    }

    return data;
  };

  const trendingData = generateTrendingData();

  // Calculate trend indicators
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = data.slice(-7).reduce((sum, item) => sum + item[key], 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + item[key], 0) / 7;
    
    if (previous === 0) return { direction: 'neutral', percentage: 0 };
    
    const percentage = ((recent - previous) / previous) * 100;
    const direction = percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral';
    
    return { direction, percentage: Math.abs(percentage) };
  };

  const starsTrend = calculateTrend(trendingData, 'stars');
  const forksTrend = calculateTrend(trendingData, 'forks');
  const activityTrend = calculateTrend(trendingData, 'activity');

  const TrendIcon = ({ direction }: { direction: string }) => {
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <Minus className="h-4 w-4 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Trend Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Stars Growth</p>
                  <p className="text-2xl font-bold text-white">
                    {starsTrend.percentage.toFixed(1)}%
                  </p>
                </div>
                <TrendIcon direction={starsTrend.direction} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Forks Growth</p>
                  <p className="text-2xl font-bold text-white">
                    {forksTrend.percentage.toFixed(1)}%
                  </p>
                </div>
                <TrendIcon direction={forksTrend.direction} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">Activity Growth</p>
                  <p className="text-2xl font-bold text-white">
                    {activityTrend.percentage.toFixed(1)}%
                  </p>
                </div>
                <TrendIcon direction={activityTrend.direction} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Trending Charts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Stars & Forks Trend (30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="stars" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name="Stars"
                />
                <Line 
                  type="monotone" 
                  dataKey="forks" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  name="Forks"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Area Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Repository Activity Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke="#8B5CF6"
                  fill="url(#activityGradient)"
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
