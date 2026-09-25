"use client";
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface InsightPoint {
  name: string;
  views: number;
  requests: number;
}

/** TODO(api): replace with a real analytics endpoint when the backend ships one. */
const MOCK_DATA: InsightPoint[] = [
  { name: "Jan", views: 10, requests: 5 },
  { name: "Feb", views: 40, requests: 25 },
  { name: "Mar", views: 30, requests: 15 },
  { name: "Apr", views: 45, requests: 10 },
  { name: "May", views: 0, requests: 0 },
  { name: "Jun", views: 0, requests: 0 },
  { name: "Jul", views: 0, requests: 0 },
  { name: "Aug", views: 0, requests: 0 },
  { name: "Sep", views: 0, requests: 0 },
  { name: "Oct", views: 0, requests: 0 },
  { name: "Nov", views: 0, requests: 0 },
  { name: "Dec", views: 0, requests: 0 },
];

interface InsightsChartProps {
  data?: InsightPoint[];
  viewedCount?: number;
  periodLabel?: string;
}

/**
 * Memoized so parent dashboard re-renders (SSE stats refresh) never
 * re-render the chart tree — a common Recharts flicker source.
 */
const InsightsChart: React.FC<InsightsChartProps> = React.memo(
  function InsightsChart({
    data = MOCK_DATA,
    viewedCount = 45,
    periodLabel = "Today",
  }) {
    // Stable reference even when callers pass an inline array.
    const points = useMemo(
      () => (data === MOCK_DATA ? MOCK_DATA : data),
      [data],
    );

    return (
      <div className="flex flex-col w-full rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
        {/* Header */}
        <div className="bg-gray-50/80 px-4 sm:px-6 py-4 flex justify-between items-center">
          <h3 className="text-gray-900 font-semibold">Insights</h3>
        </div>

        {/* Body */}
        <div className="bg-white px-4 sm:px-6 py-6 flex flex-col">
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-600 text-sm">
                  Your services was viewed by
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-medium">
                  {periodLabel}
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {viewedCount}{" "}
                <span className="text-sm font-normal text-gray-400">people</span>
              </p>
            </div>

            {/* Custom Legend */}
            <div className="flex gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#FFE082] rounded-sm"></span> Views
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#4CAF50] rounded-sm"></span> Request
              </div>
            </div>
          </div>

          {/* Fixed-height chart area — sized by content, no scroll containers */}
          <div className="w-full">
            <div className="h-[200px] sm:h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={points} barSize={8}>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#9CA3AF" }}
                    dy={10}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  {/* Animation off — prevents re-draw flash on any re-render */}
                  <Bar
                    dataKey="views"
                    fill="#FFE082"
                    radius={[4, 4, 4, 4]}
                    isAnimationActive={false}
                  />
                  <Bar
                    dataKey="requests"
                    fill="#4CAF50"
                    radius={[4, 4, 4, 4]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

InsightsChart.displayName = "InsightsChart";

export default InsightsChart;
