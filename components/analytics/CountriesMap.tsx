"use client";

import { useState } from "react";
import { CountryStats } from "@/types/analytics";

interface CountriesMapProps {
  countries: CountryStats[];
}

type TabType = "map" | "countries" | "regions" | "cities";

export default function CountriesMap({ countries }: CountriesMapProps) {
  const [activeTab, setActiveTab] = useState<TabType>("countries");

  const maxCount = countries.length > 0 ? Math.max(...countries.map((c) => c.count)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-gray-100 pb-3">
        <button
          onClick={() => setActiveTab("map")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "map"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Map
        </button>
        <button
          onClick={() => setActiveTab("countries")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "countries"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Countries
        </button>
        <button
          onClick={() => setActiveTab("regions")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "regions"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Regions
        </button>
        <button
          onClick={() => setActiveTab("cities")}
          className={`text-sm font-semibold pb-1 border-b-2 transition-colors ${
            activeTab === "cities"
              ? "text-gray-900 border-indigo-500"
              : "text-gray-400 border-transparent hover:text-gray-600"
          }`}
        >
          Cities
        </button>
      </div>

      {activeTab === "map" ? (
        /* Simple World Map Visualization */
        <div className="relative h-64 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full opacity-20"
            fill="currentColor"
          >
            {/* Simplified world map paths */}
            <ellipse cx="500" cy="250" rx="450" ry="200" className="text-gray-300" />
            <circle cx="200" cy="180" r="60" className="text-gray-400" />
            <circle cx="500" cy="150" r="80" className="text-gray-400" />
            <circle cx="750" cy="200" r="70" className="text-gray-400" />
            <circle cx="300" cy="300" r="50" className="text-gray-400" />
            <circle cx="600" cy="320" r="45" className="text-gray-400" />
          </svg>
          
          {/* Country markers */}
          {countries.slice(0, 5).map((country, index) => (
            <div
              key={index}
              className="absolute w-3 h-3 bg-indigo-500 rounded-full animate-pulse"
              style={{
                left: `${20 + index * 18}%`,
                top: `${30 + (index % 3) * 15}%`,
              }}
              title={`${country.country}: ${country.count} visitors`}
            />
          ))}
          
          <p className="absolute bottom-4 left-4 text-xs text-gray-400">
            Geographic distribution
          </p>
        </div>
      ) : (
        /* Countries List */
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
            <span>Country</span>
            <span>Visitors</span>
          </div>
          
          {countries.length > 0 ? (
            countries.slice(0, 10).map((country, index) => {
              const percentage = (country.count / maxCount) * 100;
              return (
                <div key={index} className="relative group">
                  <div
                    className="absolute inset-y-0 left-0 bg-blue-100 rounded transition-all group-hover:bg-blue-200"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between py-2 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getCountryFlag(country.country)}</span>
                      <span className="text-sm font-medium text-gray-700">
                        {country.country || "Unknown"}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {country.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-400 text-sm py-4 text-center">No data available</p>
          )}
        </div>
      )}
    </div>
  );
}

function getCountryFlag(country: string): string {
  const c = country?.toLowerCase() || "";
  if (c.includes("united states") || c === "us" || c === "usa") return "🇺🇸";
  if (c.includes("india") || c === "in") return "🇮🇳";
  if (c.includes("united kingdom") || c === "uk" || c === "gb") return "🇬🇧";
  if (c.includes("germany") || c === "de") return "🇩🇪";
  if (c.includes("france") || c === "fr") return "🇫🇷";
  if (c.includes("canada") || c === "ca") return "🇨🇦";
  if (c.includes("australia") || c === "au") return "🇦🇺";
  if (c.includes("japan") || c === "jp") return "🇯🇵";
  if (c.includes("china") || c === "cn") return "🇨🇳";
  if (c.includes("brazil") || c === "br") return "🇧🇷";
  return "🌍";
}
