"use client";

import { useState } from "react";
import { PopularPage } from "@/types/analytics";

interface TopPagesTableProps {
  pages: PopularPage[];
  totalViews: number;
}

type TabType = "top" | "entry" | "exit";

export default function TopPagesTable({ pages, totalViews }: TopPagesTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("top");

  const maxViews = pages.length > 0 ? Math.max(...pages.map((p) => p.views)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("top")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "top"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Top Pages
        </button>
        <button
          onClick={() => setActiveTab("entry")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "entry"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Entry Pages
        </button>
        <button
          onClick={() => setActiveTab("exit")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "exit"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Exit Pages
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
        <span>Page</span>
        <div className="flex gap-6">
          <span className="w-16 text-right">Visitors</span>
          <span className="w-12 text-right">%</span>
        </div>
      </div>

      {/* Pages List */}
      <div className="space-y-2">
        {pages.length > 0 ? (
          pages.slice(0, 10).map((page, index) => {
            const percentage = totalViews > 0 
              ? ((page.views / totalViews) * 100).toFixed(1) 
              : "0.0";
            const barWidth = (page.views / maxViews) * 100;
            
            return (
              <div key={index} className="relative group">
                <div
                  className="absolute inset-y-0 left-0 bg-emerald-100 rounded transition-all group-hover:bg-emerald-200"
                  style={{ width: `${barWidth}%` }}
                />
                <div className="relative flex items-center justify-between py-2 px-3">
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {formatPageUrl(page.url)}
                  </span>
                  <div className="flex gap-6">
                    <span className="text-sm font-semibold text-gray-900 w-16 text-right">
                      {page.views.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-400 text-sm py-4 text-center">No data available</p>
        )}
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
