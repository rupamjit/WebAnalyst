"use client";

import { useState } from "react";
import { TrafficSource } from "@/types/analytics";

interface SourcesTableProps {
  sources: TrafficSource[];
  totalViews: number;
}

type TabType = "sources" | "campaigns";

export default function SourcesTable({ sources, totalViews }: SourcesTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("sources");

  const maxCount = sources.length > 0 ? Math.max(...sources.map((s) => s.count)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-3">
        <span className="text-xs text-gray-400 uppercase tracking-wide">Channels</span>
        <button
          onClick={() => setActiveTab("sources")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "sources"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Sources
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "campaigns"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Campaigns
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
        <span>Source</span>
        <span>Visitors</span>
      </div>

      {/* Sources List */}
      <div className="space-y-2">
        {sources.length > 0 ? (
          sources.slice(0, 10).map((source, index) => {
            const percentage = (source.count / maxCount) * 100;
            return (
              <div key={index} className="relative group">
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-100 rounded transition-all group-hover:bg-indigo-200"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex items-center justify-between py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getSourceIcon(source.source)}
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      {formatSourceName(source.source)}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {source.count.toLocaleString()}
                  </span>
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

function getSourceIcon(source: string): string {
  const s = source.toLowerCase();
  if (s.includes("google")) return "🔍";
  if (s.includes("facebook")) return "📘";
  if (s.includes("twitter") || s.includes("x.com")) return "🐦";
  if (s.includes("github")) return "🐙";
  if (s.includes("linkedin")) return "💼";
  if (s.includes("reddit")) return "🤖";
  if (s.includes("direct") || s === "direct") return "🔗";
  if (s.includes("bing")) return "🔎";
  if (s.includes("duckduckgo")) return "🦆";
  return "🌐";
}

function formatSourceName(source: string): string {
  if (source.toLowerCase() === "direct" || !source) return "Direct / None";
  try {
    const url = new URL(source.startsWith("http") ? source : `https://${source}`);
    return url.hostname.replace("www.", "");
  } catch {
    return source;
  }
}
