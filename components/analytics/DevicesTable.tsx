"use client";

import { useState } from "react";
import { DeviceStats, OSStats } from "@/types/analytics";

interface DevicesTableProps {
  devices: DeviceStats[];
  operatingSystems: OSStats[];
}

type TabType = "devices" | "os";

export default function DevicesTable({ devices, operatingSystems }: DevicesTableProps) {
  const [activeTab, setActiveTab] = useState<TabType>("devices");

  const data = activeTab === "devices" ? devices : operatingSystems;
  const maxCount = data.length > 0 
    ? Math.max(...data.map((d) => ("device" in d ? d.count : d.count))) 
    : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("devices")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "devices"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Devices
        </button>
        <button
          onClick={() => setActiveTab("os")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "os"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          OS
        </button>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
        <span>{activeTab === "devices" ? "Device" : "Operating System"}</span>
        <span>Visitors</span>
      </div>

      {/* List */}
      <div className="space-y-2">
        {data.length > 0 ? (
          data.slice(0, 5).map((item, index) => {
            const name = "device" in item ? item.device : item.os;
            const count = item.count;
            const percentage = (count / maxCount) * 100;
            
            return (
              <div key={index} className="relative group">
                <div
                  className="absolute inset-y-0 left-0 bg-purple-100 rounded transition-all group-hover:bg-purple-200"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex items-center justify-between py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getDeviceIcon(name, activeTab)}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {name || "Unknown"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {count.toLocaleString()}
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

function getDeviceIcon(name: string, type: TabType): string {
  const n = name?.toLowerCase() || "";
  
  if (type === "devices") {
    if (n.includes("desktop") || n.includes("computer")) return "🖥️";
    if (n.includes("mobile") || n.includes("phone")) return "📱";
    if (n.includes("tablet")) return "📲";
    return "💻";
  }
  
  // OS icons
  if (n.includes("windows")) return "🪟";
  if (n.includes("mac") || n.includes("ios")) return "🍎";
  if (n.includes("android")) return "🤖";
  if (n.includes("linux")) return "🐧";
  if (n.includes("chrome")) return "🌐";
  return "💻";
}
