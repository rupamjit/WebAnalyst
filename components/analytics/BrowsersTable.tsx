import { BrowserStats } from "@/types/analytics";

interface BrowsersTableProps {
  browsers: BrowserStats[];
}

export default function BrowsersTable({ browsers }: BrowsersTableProps) {
  const maxCount = browsers.length > 0 ? Math.max(...browsers.map((b) => b.count)) : 1;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
        <h3 className="text-sm font-semibold text-gray-900">Browsers</h3>
      </div>

      {/* Table Header */}
      <div className="flex justify-between text-xs text-gray-500 uppercase tracking-wide mb-3">
        <span>Browser</span>
        <span>Visitors</span>
      </div>

      {/* Browsers List */}
      <div className="space-y-2">
        {browsers.length > 0 ? (
          browsers.slice(0, 8).map((browser, index) => {
            const percentage = (browser.count / maxCount) * 100;
            return (
              <div key={index} className="relative group">
                <div
                  className="absolute inset-y-0 left-0 bg-amber-100 rounded transition-all group-hover:bg-amber-200"
                  style={{ width: `${percentage}%` }}
                />
                <div className="relative flex items-center justify-between py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getBrowserIcon(browser.browser)}</span>
                    <span className="text-sm font-medium text-gray-700">
                      {browser.browser || "Unknown"}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {browser.count.toLocaleString()}
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

function getBrowserIcon(browser: string): string {
  const b = browser?.toLowerCase() || "";
  if (b.includes("chrome")) return "🟢";
  if (b.includes("safari")) return "🔵";
  if (b.includes("firefox")) return "🟠";
  if (b.includes("edge")) return "🔷";
  if (b.includes("opera")) return "🔴";
  if (b.includes("brave")) return "🦁";
  if (b.includes("samsung")) return "💜";
  return "🌐";
}
