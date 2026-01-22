import { AnalyticsOverview } from "@/types/analytics";

interface OverviewCardsProps {
  overview: AnalyticsOverview;
}

export default function OverviewCards({ overview }: OverviewCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-blue-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-blue-600 uppercase">
          Total Page Views
        </h3>
        <p className="text-3xl font-bold text-blue-900 mt-2">
          {overview.totalPageViews.toLocaleString()}
        </p>
      </div>

      <div className="bg-green-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-green-600 uppercase">
          Unique Visitors
        </h3>
        <p className="text-3xl font-bold text-green-900 mt-2">
          {overview.uniqueVisitors.toLocaleString()}
        </p>
      </div>

      <div className="bg-purple-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-purple-600 uppercase">
          Avg. Active Time
        </h3>
        <p className="text-3xl font-bold text-purple-900 mt-2">
          {overview.avgActiveTime}s
        </p>
      </div>

      <div className="bg-orange-50 rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-orange-600 uppercase">
          Total Active Time
        </h3>
        <p className="text-3xl font-bold text-orange-900 mt-2">
          {(overview.totalActiveTime / 60).toFixed(1)}m
        </p>
      </div>
    </div>
  );
}
