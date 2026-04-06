import React, { useMemo } from "react";
import { View, Dimensions, useColorScheme } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Card, Text, EmptyState } from "./ui";
import { Colors } from "../Styles/Theme";
import { formatTimeShort, formatDateShort } from "../utils/timeFormatting";

interface AthleteTimesChartProps {
  times: Record<string, any>[];
  className?: string;
}

export default function AthleteTimesChart({
  times,
  className = "",
}: AthleteTimesChartProps) {
  const scheme = useColorScheme() ?? "light";
  const theme = Colors[scheme];
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
          color: (opacity = 1) => `rgba(79, 195, 247, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    };
  }, [times]);

  const chartConfig = useMemo(
    () => ({
      backgroundGradientFrom: theme.backgroundCard,
      backgroundGradientFromOpacity: 1,
      backgroundGradientTo: theme.backgroundCard,
      backgroundGradientToOpacity: 1,
      decimalPlaces: 0,
      color: (opacity = 1) => `rgba(79, 195, 247, ${opacity})`,
      labelColor: (opacity = 1) =>
        scheme === "dark"
          ? `rgba(255, 255, 255, ${opacity})`
          : `rgba(26, 43, 60, ${opacity})`,
      propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: Colors.primaryDark,
      },
      propsForBackgroundLines: {
        stroke: theme.border,
      },
      fillShadowGradientFrom: Colors.primary,
      fillShadowGradientFromOpacity: 0.2,
      fillShadowGradientTo: Colors.primary,
      fillShadowGradientToOpacity: 0,
    }),
    [scheme, theme]
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
