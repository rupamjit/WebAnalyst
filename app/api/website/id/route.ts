import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    // Authenticate user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get website ID from URL
    const url = new URL(req.url);
    const websiteId = url.searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json(
        { error: "Website ID is required" },
        { status: 400 }
      );
    }

    // Find the user in the database
    const findUser = await prisma.user.findFirst({
      where: {
        clerkId: user.id,
      },
    });

    if (!findUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch website details and verify ownership
    const website = await prisma.website.findFirst({
      where: {
        websiteId,
        userId: findUser.id,
      },
    });

    if (!website) {
      return NextResponse.json(
        { error: "Website not found or unauthorized" },
        { status: 404 }
      );
    }

    // Fetch all page views for this website
    const pageViews = await prisma.websitePageView.findMany({
      where: {
        websiteId,
      },
      orderBy: {
        serverTimestamp: "desc",
      },
    });

    // Calculate analytics metrics
    const totalPageViews = pageViews.length;

    // Unique visitors (based on unique IP addresses)
    const uniqueVisitors = new Set(
      pageViews.map((view) => view.ip).filter((ip) => ip)
    ).size;

    // Average active time (in seconds)
    const totalActiveTime = pageViews.reduce(
      (sum, view) => sum + (view.activeTime || 0),
      0
    );
    const avgActiveTime =
      totalPageViews > 0 ? Math.round(totalActiveTime / totalPageViews) : 0;

    // Popular pages
    const pageStats = pageViews.reduce((acc, view) => {
      const page = view.url;
      if (!acc[page]) {
        acc[page] = { url: page, views: 0, avgTime: 0 };
      }
      acc[page].views += 1;
      acc[page].avgTime += view.activeTime || 0;
      return acc;
    }, {} as Record<string, { url: string; views: number; avgTime: number }>);

    const popularPages = Object.values(pageStats)
      .map((page) => ({
        ...page,
        avgTime: page.views > 0 ? Math.round(page.avgTime / page.views) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Traffic sources (referrers)
    const referrerStats = pageViews.reduce((acc, view) => {
      const referrer = view.referrer || "Direct";
      if (!acc[referrer]) {
        acc[referrer] = 0;
      }
      acc[referrer] += 1;
      return acc;
    }, {} as Record<string, number>);

    const trafficSources = Object.entries(referrerStats)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Device statistics
    const deviceStats = pageViews.reduce((acc, view) => {
      const device = view.device || "Unknown";
      if (!acc[device]) {
        acc[device] = 0;
      }
      acc[device] += 1;
      return acc;
    }, {} as Record<string, number>);

    const devices = Object.entries(deviceStats).map(([device, count]) => ({
      device,
      count,
    }));

    // Browser statistics
    const browserStats = pageViews.reduce((acc, view) => {
      const browser = view.browser || "Unknown";
      if (!acc[browser]) {
        acc[browser] = 0;
      }
      acc[browser] += 1;
      return acc;
    }, {} as Record<string, number>);

    const browsers = Object.entries(browserStats).map(([browser, count]) => ({
      browser,
      count,
    }));

    // OS statistics
    const osStats = pageViews.reduce((acc, view) => {
      const os = view.os || "Unknown";
      if (!acc[os]) {
        acc[os] = 0;
      }
      acc[os] += 1;
      return acc;
    }, {} as Record<string, number>);

    const operatingSystems = Object.entries(osStats).map(([os, count]) => ({
      os,
      count,
    }));

    // Geographic data
    const countryStats = pageViews.reduce((acc, view) => {
      const country = view.country || "Unknown";
      if (!acc[country]) {
        acc[country] = 0;
      }
      acc[country] += 1;
      return acc;
    }, {} as Record<string, number>);

    const countries = Object.entries(countryStats)
      .map(([country, count]) => ({
        country,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // UTM campaign statistics
    const utmStats = pageViews
      .filter((view) => view.utm_campaign)
      .reduce((acc, view) => {
        const campaign = view.utm_campaign!;
        if (!acc[campaign]) {
          acc[campaign] = {
            campaign,
            source: view.utm_source || "Unknown",
            medium: view.utm_medium || "Unknown",
            count: 0,
          };
        }
        acc[campaign].count += 1;
        return acc;
      }, {} as Record<string, { campaign: string; source: string; medium: string; count: number }>);

    const campaigns = Object.values(utmStats).sort((a, b) => b.count - a.count);

    // Time-based analytics (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const recentViews = pageViews.filter(
      (view) => new Date(view.serverTimestamp) >= last7Days
    );

    // Group by day
    const viewsByDay = recentViews.reduce((acc, view) => {
      const date = new Date(view.serverTimestamp).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {} as Record<string, number>);

    const dailyViews = Object.entries(viewsByDay)
      .map(([date, count]) => ({
        date,
        count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Hourly distribution (for last 24 hours)
    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const recentHourlyViews = pageViews.filter(
      (view) => new Date(view.serverTimestamp) >= last24Hours
    );

    const viewsByHour = recentHourlyViews.reduce((acc, view) => {
      const hour = new Date(view.serverTimestamp).getHours();
      if (!acc[hour]) {
        acc[hour] = 0;
      }
      acc[hour] += 1;
      return acc;
    }, {} as Record<number, number>);

    const hourlyViews = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: viewsByHour[i] || 0,
    }));

    // Construct the response
    const analyticsData = {
      website: {
        id: website.id,
        websiteId: website.websiteId,
        domain: website.domain,
        timezone: website.timezone,
        enableLocalTracking: website.enableLocalTracking,
        createdAt: website.createdAt,
        updatedAt: website.updatedAt,
      },
      overview: {
        totalPageViews,
        uniqueVisitors,
        avgActiveTime,
        totalActiveTime: Math.round(totalActiveTime),
      },
      popularPages,
      trafficSources,
      devices,
      browsers,
      operatingSystems,
      countries,
      campaigns,
      timeAnalytics: {
        dailyViews,
        hourlyViews,
      },
      recentPageViews: pageViews.slice(0, 20), // Last 20 page views
    };

    return NextResponse.json(analyticsData, { status: 200 });
  } catch (error) {
    console.error("Error fetching website analytics:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};