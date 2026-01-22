"use client";

import { DailyView } from "@/types/analytics";

interface VisitorsChartProps {
  dailyViews: DailyView[];
}

export default function VisitorsChart({ dailyViews }: VisitorsChartProps) {
  if (dailyViews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-72 flex items-center justify-center">
        <p className="text-gray-400">No data available for the chart</p>
      </div>
    );
  }

  const maxCount = Math.max(...dailyViews.map((d) => d.count), 1);
  const chartHeight = 200;
  
  // Generate points for the line
  const points = dailyViews.map((day, index) => {
    const x = (index / Math.max(dailyViews.length - 1, 1)) * 100;
    const y = 100 - (day.count / maxCount) * 100;
    return { x, y, count: day.count, date: day.date };
  });

  // Create SVG path
  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  // Create area path (for fill)
  const areaPath = `${linePath} L 100 100 L 0 100 Z`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      {/* Y-axis labels */}
      <div className="flex">
        <div className="flex flex-col justify-between h-52 pr-4 text-xs text-gray-400">
          <span>{maxCount.toLocaleString()}</span>
          <span>{Math.round(maxCount * 0.75).toLocaleString()}</span>
          <span>{Math.round(maxCount * 0.5).toLocaleString()}</span>
          <span>{Math.round(maxCount * 0.25).toLocaleString()}</span>
          <span>0</span>
        </div>

        {/* Chart */}
        <div className="flex-1 relative h-52">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="border-t border-gray-100 w-full" />
            ))}
          </div>

          {/* SVG Chart */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {/* Area fill */}
            <path
              d={areaPath}
              fill="url(#gradient)"
              className="opacity-30"
            />
            
            {/* Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#6366f1"
              strokeWidth="0.5"
              vectorEffect="non-scaling-stroke"
              className="drop-shadow-sm"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Data points */}
          {points.map((point, index) => (
            <div
              key={index}
              className="absolute w-2 h-2 bg-indigo-500 rounded-full transform -translate-x-1 -translate-y-1 hover:scale-150 transition-transform cursor-pointer group"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
              }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                  {point.count.toLocaleString()} visitors
                  <br />
                  {new Date(point.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-3 pl-10 text-xs text-gray-400">
        {dailyViews.map((day, index) => {
          // Only show some labels to avoid crowding
          if (dailyViews.length <= 7 || index % Math.ceil(dailyViews.length / 7) === 0) {
            return (
              <span key={index}>
                {new Date(day.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
