'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CHART_COLORS } from '@/lib/site'

interface PointsChartProps {
  data: Array<{ team: string; points: number; goalDifference: number }>
}

export function PointsChart({ data }: PointsChartProps) {
  return (
    <div className="w-full h-48 sm:h-64 lg:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="team"
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            axisLine={{ stroke: CHART_COLORS.line }}
            tickLine={false}
            interval={0}
            height={48}
            angle={-20}
            textAnchor="end"
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
          <Bar
            dataKey="points"
            name="Points"
            fill={CHART_COLORS.primary}
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
            animationDuration={900}
            maxBarSize={38}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
