import { AnalyticCard } from '@/app/login/components/analytics-card';
import { motion } from 'framer-motion';
import { BarChart2, PieChart, Activity, Bell } from 'lucide-react'; // Assuming you're using lucide-react for icons

const AnalyticsToolsSection = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="md:flex md:flex-col md:justify-center space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnalyticCard
          title="Atlas"
          value="Market Sentiments"
          icon={<BarChart2 className="h-4 w-4 text-blue-500" />}
          change="Realtime Nifty Analysis"
          changeDirection="neutral"
          link="/atlas"
        />
        <AnalyticCard
          title="Breakouts"
          value="Market Breakouts"
          icon={<PieChart className="h-4 w-4 text-purple-500" />}
          change="Find bullish or bearish entries"
          changeDirection="neutral"
          link="/bollinger-breakouts"
        />
        <AnalyticCard
          title="Scanners"
          value="Live Scans"
          icon={<Activity className="h-4 w-4 text-yellow-500" />}
          change="Real-time stock scanners"
          changeDirection="neutral"
          link="/scanners"
        />
        <AnalyticCard
          title="Alerts"
          value="Stock Alerts"
          icon={<Bell className="h-4 w-4 text-orange-500" />}
          change="Never miss an entry in stocks"
          changeDirection="neutral"
          link="/alerts"
        />
      </div>
    </motion.div>
  );
};

export default AnalyticsToolsSection;