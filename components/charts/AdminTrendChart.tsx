'use client'

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS } from '@/lib/site'
import { formatDayMonth } from '@/lib/format'

interface AdminTrendChartProps {
  data: Array<{ week: string; matches: number; played: number }>
}

export function AdminTrendChart({ data }: AdminTrendChartProps) {
  const chartData = data.map((row) => ({
    week: formatDayMonth(row.week),
    matches: row.matches,
    played: row.played,
  }))

  return (
    <div className="w-full h-48 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            axisLine={{ stroke: CHART_COLORS.line }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{ fontSize: 12, borderColor: CHART_COLORS.line, borderRadius: 0 }}
            labelStyle={{ fontWeight: 700, color: CHART_COLORS.black }}
          />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Line
            type="monotone"
            dataKey="matches"
            name="Matches scheduled"
            stroke={CHART_COLORS.primary}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.primary }}
            isAnimationActive={true}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="played"
            name="Results entered"
            stroke={CHART_COLORS.black}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.black }}
            isAnimationActive={true}
            animationDuration={1000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
