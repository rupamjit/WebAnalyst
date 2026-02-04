"use client";

import WebsiteAnalyticsDashboard from "@/components/WebsiteAnalyticsDashboard";
import Navbar from "@/components/Navbar";
import { AnalyticsData } from "@/types/analytics";

//  data for the public demo page
const DEMO_DATA: AnalyticsData = {
  website: {
    id: "demo-public",
    websiteId: "demo-public",
    domain: "demo.webanalyst.com",
    timezone: "UTC",
    enableLocalTracking: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  overview: { 
    uniqueVisitors: 12453,
    totalPageViews: 45231,
    avgActiveTime: 184, 
    totalActiveTime: 8322504
  },
  timeAnalytics: {
    dailyViews: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toISOString().split('T')[0],
        count: [1200, 1350, 1100, 1600, 1900, 1750, 2100][i] || 1500
      };
    }),
    hourlyViews: []
  },
  trafficSources: [
    { source: "google", count: 15400 },
    { source: "direct", count: 12000 },
    { source: "twitter.com", count: 8500 },
    { source: "github.com", count: 5000 },
    { source: "linkedin.com", count: 3200 }
  ],
  popularPages: [
    { url: "/", views: 18000, avgTime: 120 },
    { url: "/blog", views: 8500, avgTime: 180 },
    { url: "/pricing", views: 6200, avgTime: 60 },
    { url: "/docs/start", views: 4100, avgTime: 240 },
    { url: "/about", views: 3000, avgTime: 90 }
  ],
  entryPages: [
     { url: "/", views: 12500, avgTime: 0 },
     { url: "/blog/post-1", views: 3200, avgTime: 0 },
     { url: "/features", views: 2800, avgTime: 0 },
     { url: "/pricing", views: 1500, avgTime: 0 },
     { url: "/docs/start", views: 1200, avgTime: 0 }
  ],
  exitPages: [
     { url: "/pricing", views: 4200, avgTime: 0 },
     { url: "/docs/api", views: 2100, avgTime: 0 },
     { url: "/blog", views: 1800, avgTime: 0 },
     { url: "/contact", views: 1500, avgTime: 0 },
     { url: "/", views: 1200, avgTime: 0 }
  ],
  countries: [
    { country: "US", count: 18000 },
    { country: "IN", count: 8000 },
    { country: "GB", count: 5500 },
    { country: "DE", count: 4200 },
    { country: "CA", count: 3100 },
    { country: "FR", count: 2800 }
  ],
  regions: [
    { region: "California", country: "US", count: 5200 },
    { region: "New York", country: "US", count: 4100 },
    { region: "England", country: "GB", count: 3800 },
    { region: "Karnataka", country: "IN", count: 2500 },
    { region: "Berlin", country: "DE", count: 2100 },
    { region: "Maharashtra", country: "IN", count: 1800 }
  ],
  cities: [
    { city: "San Francisco", country: "US", count: 3200 },
    { city: "London", country: "GB", count: 2800 },
    { city: "New York", country: "US", count: 2500 },
    { city: "Bangalore", country: "IN", count: 2200 },
    { city: "Berlin", country: "DE", count: 2100 },
    { city: "Paris", country: "FR", count: 1500 }
  ],
  devices: [
    { device: "Desktop", count: 28000 },
    { device: "Mobile", count: 15000 },
    { device: "Tablet", count: 2231 }
  ],
  browsers: [
    { browser: "Chrome", count: 25000 },
    { browser: "Safari", count: 12000 },
    { browser: "Firefox", count: 5000 },
    { browser: "Edge", count: 3231 }
  ],
  operatingSystems: [
    { os: "Windows", count: 20000 },
    { os: "Mac OS", count: 15000 },
    { os: "iOS", count: 6000 },
    { os: "Android", count: 4231 }
  ],
  campaigns: [],
  recentPageViews: [
    { 
      id: "1", 
      type: "pageview",
      websiteId: "demo-public",
      domain: "demo.webanalyst.com",
      url: "/pricing", 
      referrer: "google.com",
      entryTime: new Date(),
      exitTime: null,
      activeTime: 0,
      serverTimestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 mins ago
      userAgent: "Mozilla/5.0", 
      device: "Desktop", 
      browser: "Chrome", 
      browserVersion: "120.0",
      os: "Mac OS", 
      osVersion: "14.2",
      language: "en-US",
      ip: "127.0.0.1", 
      country: "US", 
      region: "CA",
      city: "San Francisco", 
      timezone: "America/Los_Angeles",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { 
      id: "2", 
      type: "pageview",
      websiteId: "demo-public",
      domain: "demo.webanalyst.com",
      url: "/", 
      referrer: "twitter.com",
      entryTime: new Date(),
      exitTime: null,
      activeTime: 0,
      serverTimestamp: new Date(Date.now() - 1000 * 60 * 5),
      userAgent: "Mozilla/5.0", 
      device: "Mobile", 
      browser: "Safari", 
      browserVersion: "17.0",
      os: "iOS", 
      osVersion: "17.2",
      language: "en-US",
      ip: "127.0.0.1",
      country: "DE", 
      region: "BE",
      city: "Berlin", 
      timezone: "Europe/Berlin",
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      utm_term: null,
      utm_content: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ]
};

export default function PublicDemoPage() {
  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary/5 border border-primary/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <span className="text-3xl">👋</span>
              <div>
                <h1 className="text-2xl font-bold text-primary">Live Demo Preview</h1>
                <p className="text-primary/80 max-w-2xl mt-1">
                  Experience the full power of WebAnalyst without signing up. 
                  This page demonstrates exactly how your dashboard will look once you start tracking your own website.
                </p>
              </div>
            </div>
          </div>
          
          <WebsiteAnalyticsDashboard websiteId="demo-public" initialData={DEMO_DATA} />
        </div>
      </main>
    </div>
  );
}
