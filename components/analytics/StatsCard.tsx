interface StatsCardProps {
  label: string;
  value: string | number;
  change?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export default function StatsCard({
  label,
  value,
  change,
  isActive = false,
  onClick,
}: StatsCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <button
      onClick={onClick}
      className={`text-left p-3 rounded-lg transition-all ${
        isActive
          ? "bg-indigo-50 border-2 border-indigo-500"
          : "hover:bg-gray-50 border-2 border-transparent"
      }`}
    >
      <p
        className={`text-xs font-medium uppercase tracking-wide ${
          isActive ? "text-indigo-600" : "text-gray-500"
        }`}
      >
        {label}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className={`text-2xl font-bold ${isActive ? "text-indigo-700" : "text-gray-900"}`}>
          {typeof value === "number" ? value.toLocaleString() : value}
        </span>
        {change !== undefined && (
          <span
            className={`text-sm font-medium ${
              isPositive
                ? "text-green-600"
                : isNegative
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            {isPositive ? "↑" : isNegative ? "↓" : ""}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </button>
  );
}
