import React, { useMemo } from "react";
import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, Text, EmptyState } from "@/components/ui";
import { Colors } from "@/Styles/Theme";
import { useThemeColors } from "@/hooks/useThemeColors";
import { formatTimeShort, formatDateShort } from "@/utils/timeFormatting";

/** Convert a 3- or 6-char hex color to an rgba string. */
function hexToRgba(hex: string, opacity: number): string {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(f.slice(0, 2), 16);
  const g = parseInt(f.slice(2, 4), 16);
  const b = parseInt(f.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

interface AthleteTimesChartProps {
  times: Record<string, any>[];
  className?: string;
}

export default function AthleteTimesChart({
  times,
  className = "",
}: AthleteTimesChartProps) {
  const colors = useThemeColors();
  const screenWidth = Dimensions.get("window").width;

  const chartData = useMemo(() => {
    if (times.length === 0) return null;

    const sorted = [...times].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    const maxLabels = 6;
    const step = Math.max(1, Math.ceil(sorted.length / maxLabels));

    const labels = sorted.map((t, i) =>
      i % step === 0 || i === sorted.length - 1
        ? formatDateShort(t.created_at)
        : ""
    );

    return {
      labels,
      datasets: [
        {
          data: sorted.map((t) => t.Time),
          color: (opacity = 1) => hexToRgba(colors.primary, opacity),
          strokeWidth: 2,
        },
      ],
    };
  }, [times, colors.primary]);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: colors.backgroundCard,
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: colors.backgroundCard,
      backgroundGradientToOpacity: 1,
      decimalPlaces: 0,
      color: (opacity = 1) => hexToRgba(colors.primary, opacity),
      labelColor: (opacity = 1) => hexToRgba(colors.foreground, opacity),
      propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: Colors.primaryDark,
      },
      propsForBackgroundLines: {
        stroke: colors.border,
      },
      fillShadowGradientFrom: colors.primary,
      fillShadowGradientFromOpacity: 0.2,
      fillShadowGradientTo: colors.primary,
      fillShadowGradientToOpacity: 0,
    }),
    [colors]
  );

  if (!chartData) {
    return (
      <Card className={className}>
        <Text variant="title" className="mb-2">
          Progression
        </Text>
        <EmptyState message="No times to chart" icon="analytics-outline" />
      </Card>
    );
  }

  return (
    <Card className={className}>
      <Text variant="title" className="mb-2">
        Progression
      </Text>
      <LineChart
        data={chartData}
        width={screenWidth - 64}
        height={200}
        chartConfig={chartConfig}
        bezier
        withInnerLines={false}
        withOuterLines={false}
        withVerticalLines={false}
        segments={4}
        formatYLabel={(val) => formatTimeShort(Number(val))}
        style={{ borderRadius: 12 }}
      />
    </Card>
  );
}
