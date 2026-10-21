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
import type { MatchStats } from '@/lib/types'

interface MatchStatsChartProps {
  stats: MatchStats
  homeName: string
  awayName: string
}

export function MatchStatsChart({ stats, homeName, awayName }: MatchStatsChartProps) {
  const data = [
    { metric: 'Possession %', home: stats.possession[0], away: stats.possession[1] },
    { metric: 'Shots', home: stats.shots[0], away: stats.shots[1] },
    { metric: 'Corners', home: stats.corners[0], away: stats.corners[1] },
    { metric: 'Fouls', home: stats.fouls[0], away: stats.fouls[1] },
  ]

  return (
    <div className="w-full h-48 sm:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={4}>
          <CartesianGrid stroke={CHART_COLORS.line} vertical={false} />
          <XAxis
            dataKey="metric"
            tick={{ fontSize: 11, fill: CHART_COLORS.muted }}
            axisLine={{ stroke: CHART_COLORS.line }}
            tickLine={false}
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
            dataKey="home"
            name={homeName}
            fill={CHART_COLORS.primary}
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
            animationDuration={900}
          />
          <Bar
            dataKey="away"
            name={awayName}
            fill={CHART_COLORS.black}
            radius={[2, 2, 0, 0]}
            isAnimationActive={true}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
