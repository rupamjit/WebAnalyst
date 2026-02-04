"use client";

import { useEffect, useState } from "react";
import { AnalyticsData } from "@/types/analytics";
import StatsCard from "./analytics/StatsCard";
import VisitorsChart from "./analytics/VisitorsChart";
import SourcesTable from "./analytics/SourcesTable";
import TopPagesTable from "./analytics/TopPagesTable";
import CountriesMap from "./analytics/CountriesMap";
import BrowsersTable from "./analytics/BrowsersTable";
import DevicesTable from "./analytics/DevicesTable";

interface WebsiteAnalyticsDashboardProps {
  websiteId: string;
  initialData?: AnalyticsData | null;
}

export default function WebsiteAnalyticsDashboard({
  websiteId,
  initialData
}: WebsiteAnalyticsDashboardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<string>("visitors");
  const [dateRange, setDateRange] = useState<string>("7d");

  useEffect(() => {
    if (initialData) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/website/id?websiteId=${websiteId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch analytics");
        }

        const data: AnalyticsData = await response.json();
        setAnalytics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (websiteId) {
      fetchAnalytics();
    }
  }, [websiteId, initialData]);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Data Available</h2>
          <p className="text-gray-600">Start tracking to see your analytics here.</p>
        </div>
      </div>
    );
  }

  // Calculate additional metrics
  const bounceRate = analytics.overview.totalPageViews > 0
    ? Math.round((analytics.overview.uniqueVisitors / analytics.overview.totalPageViews) * 100)
    : 0;
  
  const viewsPerVisit = analytics.overview.uniqueVisitors > 0
    ? (analytics.overview.totalPageViews / analytics.overview.uniqueVisitors).toFixed(2)
    : "0";

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Filter data based on date range
  const getFilteredDailyViews = () => {
    if (!analytics?.timeAnalytics?.dailyViews) return [];
    
    const now = new Date();
    const views = [...analytics.timeAnalytics.dailyViews];
    
    // Sort by date just in case
    views.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let daysToSubtract = 7;
    if (dateRange === "today") daysToSubtract = 0; // Handled separately or just show 1 day
    else if (dateRange === "30d") daysToSubtract = 30;
    else if (dateRange === "90d") daysToSubtract = 90;
    
    if (dateRange === "today") {
       // Just return today's data if exists, or last entry
       const todayStr = new Date().toISOString().split('T')[0];
       return views.filter(v => v.date === todayStr);
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(now.getDate() - daysToSubtract);
    
    return views.filter(v => new Date(v.date) >= cutoffDate);
  };

  const filteredDailyViews = getFilteredDailyViews();


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {analytics.website.domain}
            </h1>
            <p className="text-sm text-muted-foreground">
              Analytics overview
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 text-sm font-medium border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition-all cursor-pointer hover:bg-gray-50"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            <StatsCard
              label="Unique Visitors"
              value={analytics.overview.uniqueVisitors}
              change={17}
              isActive={activeMetric === "visitors"}
              onClick={() => setActiveMetric("visitors")}
            />
            <StatsCard
              label="Total Visits"
              value={analytics.overview.totalPageViews}
              change={4}
              isActive={activeMetric === "visits"}
              onClick={() => setActiveMetric("visits")}
            />
            <StatsCard
              label="Pageviews"
              value={analytics.overview.totalPageViews}
              change={20}
              isActive={activeMetric === "pageviews"}
              onClick={() => setActiveMetric("pageviews")}
            />
            <StatsCard
              label="Views/Visit"
              value={viewsPerVisit}
              change={23}
              isActive={activeMetric === "viewsPerVisit"}
              onClick={() => setActiveMetric("viewsPerVisit")}
            />
            <StatsCard
              label="Bounce Rate"
              value={`${bounceRate}%`}
              change={-14}
              isActive={activeMetric === "bounceRate"}
              onClick={() => setActiveMetric("bounceRate")}
            />
            <StatsCard
              label="Visit Duration"
              value={formatDuration(analytics.overview.avgActiveTime)}
              change={24}
              isActive={activeMetric === "duration"}
              onClick={() => setActiveMetric("duration")}
            />
          </div>
        </div>

        {/* Main Chart */}
        <div className="mb-6">
          <VisitorsChart dailyViews={filteredDailyViews} />
        </div>

        {/* Two Column Layout - Sources & Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <SourcesTable
            sources={analytics.trafficSources}
            totalViews={analytics.overview.totalPageViews}
          />
          <TopPagesTable
            pages={analytics.popularPages}
            entryPages={analytics.entryPages}
            exitPages={analytics.exitPages}
            totalViews={analytics.overview.totalPageViews}
          />
        </div>

        {/* Two Column Layout - Map & Browsers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <CountriesMap 
            countries={analytics.countries} 
            regions={analytics.regions} 
            cities={analytics.cities} 
          />
          <BrowsersTable browsers={analytics.browsers} />
        </div>

        {/* Devices Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DevicesTable
            devices={analytics.devices}
            operatingSystems={analytics.operatingSystems}
          />
          
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              Recent Activity
            </h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {analytics.recentPageViews.length > 0 ? (
                analytics.recentPageViews.slice(0, 10).map((view) => (
                  <div
                    key={view.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-xs">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatPageUrl(view.url)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {view.device} • {view.browser} • {view.country || "Unknown"}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatTimeAgo(view.serverTimestamp)}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm text-center py-8">
                  No recent activity
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatPageUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname || "/";
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

function formatTimeAgo(timestamp: Date | string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}
