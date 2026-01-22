export interface WebsiteDetails {
  id: string;
  websiteId: string;
  domain: string;
  timezone: string;
  enableLocalTracking: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsOverview {
  totalPageViews: number;
  uniqueVisitors: number;
  avgActiveTime: number;
  totalActiveTime: number;
}

export interface PopularPage {
  url: string;
  views: number;
  avgTime: number;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export interface DeviceStats {
  device: string;
  count: number;
}

export interface BrowserStats {
  browser: string;
  count: number;
}

export interface OSStats {
  os: string;
  count: number;
}

export interface CountryStats {
  country: string;
  count: number;
}

export interface CampaignStats {
  campaign: string;
  source: string;
  medium: string;
  count: number;
}

export interface DailyView {
  date: string;
  count: number;
}

export interface HourlyView {
  hour: number;
  count: number;
}

export interface TimeAnalytics {
  dailyViews: DailyView[];
  hourlyViews: HourlyView[];
}

export interface PageView {
  id: string;
  type: string;
  websiteId: string;
  domain: string;
  url: string;
  referrer: string | null;
  entryTime: Date | null;
  exitTime: Date | null;
  activeTime: number | null;
  serverTimestamp: Date;
  userAgent: string | null;
  device: string | null;
  browser: string | null;
  browserVersion: string | null;
  os: string | null;
  osVersion: string | null;
  language: string | null;
  ip: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  website: WebsiteDetails;
  overview: AnalyticsOverview;
  popularPages: PopularPage[];
  trafficSources: TrafficSource[];
  devices: DeviceStats[];
  browsers: BrowserStats[];
  operatingSystems: OSStats[];
  countries: CountryStats[];
  campaigns: CampaignStats[];
  timeAnalytics: TimeAnalytics;
  recentPageViews: PageView[];
}
