import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import {
  Text,
  Card,
  Chip,
  Divider,
  LoadingIndicator,
  EmptyState,
  FAB,
  Modal,
  Snackbar,
} from "@/components/ui";
import AthleteTimesChart from "@/components/AthleteTimesChart";
import TimeForm from "@/components/InputForms/TimeForm";
import { getData } from "@/utils/backendData";
import { formatTime, formatDateShort } from "@/utils/timeFormatting";

export default function AthleteDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [athlete, setAthlete] = useState<Record<string, any> | null>(null);
  const [times, setTimes] = useState<Record<string, any>[]>([]);
  const [teamName, setTeamName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [selectedStroke, setSelectedStroke] = useState<string | null>(null);
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);

  const [addTimeModalVisible, setAddTimeModalVisible] = useState(false);
  const [isFabExtended, setIsFabExtended] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [athleteRows, timesRows, teamsRows] = await Promise.all([
        getData("Athletes", { id: Number(id) }),
        getData("Times", { "Athlete ID": Number(id) }),
        getData("Teams"),
      ]);

      if (athleteRows.length > 0) {
        setAthlete(athleteRows[0]);
        const teamId = athleteRows[0]["Team ID"];
        if (teamId) {
          const team = teamsRows.find((t) => t.id === teamId);
          setTeamName(team?.Name ?? "");
        }
      }
      setTimes(timesRows);
    } catch {
      // getData already handles error logging
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const uniqueStrokes = useMemo(
    () => [...new Set(times.map((t) => t.Stroke).filter(Boolean))].sort(),
    [times]
  );

  const uniqueDistances = useMemo(() => {
    const set = new Set(
      times.map((t) => `${t.Distance} ${t["Distance Unit"]}`)
    );
    return [...set].sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      return numA - numB;
    });
  }, [times]);

  const filteredTimes = useMemo(() => {
    let result = times;
    if (selectedStroke) {
      result = result.filter((t) => t.Stroke === selectedStroke);
    }
    if (selectedDistance) {
      const [dist, unit] = selectedDistance.split(" ");
      result = result.filter(
        (t) => String(t.Distance) === dist && t["Distance Unit"] === unit
      );
    }
    return result;
  }, [times, selectedStroke, selectedDistance]);

  const handleFormSuccess = useCallback((msg: string) => {
    setAddTimeModalVisible(false);
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
    fetchData();
  }, [fetchData]);

  const onFlatListScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsFabExtended(currentScrollPosition <= 0);
  };

  const sortedTimesForList = useMemo(
    () =>
      [...times].sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [times]
  );

  if (loading) {
    return (
      <View className="flex-1 bg-background justify-center">
        <LoadingIndicator />
      </View>
    );
  }

  if (!athlete) {
    return (
      <View className="flex-1 bg-background justify-center">
        <EmptyState message="Athlete not found" icon="person-outline" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <FlatList
        data={sortedTimesForList}
        keyExtractor={(item) => String(item.id)}
        onScroll={onFlatListScroll}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <View className="px-4">
            {/* Athlete Info */}
            <Card className="mt-14">
              <Text variant="headline" className="mb-1">
                {athlete.Name}
              </Text>
              <View className="flex-row gap-4 mt-1">
                <View>
                  <Text variant="label-sm" className="text-foreground-muted">
                    Age
                  </Text>
                  <Text variant="body">{athlete.Age ?? "—"}</Text>
                </View>
                <View>
                  <Text variant="label-sm" className="text-foreground-muted">
                    Group
                  </Text>
                  <Text variant="body">{teamName || "—"}</Text>
                </View>
              </View>
            </Card>

            {/* Filters */}
            {times.length > 0 && (
              <Card>
                <Text variant="label" className="mb-2">
                  Filter Chart
                </Text>
                {uniqueStrokes.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-2"
                  >
                    <View className="flex-row gap-1.5">
                      {uniqueStrokes.map((stroke) => (
                        <Chip
                          key={stroke}
                          label={stroke}
                          compact
                          selected={selectedStroke === stroke}
                          onPress={() =>
                            setSelectedStroke(
                              selectedStroke === stroke ? null : stroke
                            )
                          }
                        />
                      ))}
                    </View>
                  </ScrollView>
                )}
                {uniqueDistances.length > 0 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    <View className="flex-row gap-1.5">
                      {uniqueDistances.map((dist) => (
                        <Chip
                          key={dist}
                          label={dist}
                          compact
                          selected={selectedDistance === dist}
                          onPress={() =>
                            setSelectedDistance(
                              selectedDistance === dist ? null : dist
                            )
                          }
                        />
                      ))}
                    </View>
                  </ScrollView>
                )}
              </Card>
            )}

            {/* Chart */}
            <AthleteTimesChart times={filteredTimes} />

            {/* Times List Header */}
            <Text variant="title" className="mt-4 mb-2 px-1">
              All Times
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-4">
            <View className="flex-row items-center justify-between py-3 px-1">
              <View className="flex-1">
                <Text variant="body" className="font-medium">
                  {item.Stroke}
                </Text>
                <Text variant="body-sm" className="text-foreground-muted">
                  {item.Distance} {item["Distance Unit"]}
                </Text>
              </View>
              <View className="items-end">
                <Text variant="body" className="font-semibold text-primary">
                  {formatTime(item.Time)}
                </Text>
                <Text variant="body-sm" className="text-foreground-muted">
                  {formatDateShort(item.created_at)}
                </Text>
              </View>
            </View>
            <Divider />
          </View>
        )}
        ListEmptyComponent={
          <View className="px-4">
            <EmptyState message="No times recorded yet" icon="timer-outline" />
          </View>
        }
      />

      <Modal
        visible={addTimeModalVisible}
        onClose={() => setAddTimeModalVisible(false)}
        title="Add Time"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TimeForm
            initialAthleteId={Number(id)}
            initialAthleteName={athlete.Name}
            onSuccess={handleFormSuccess}
          />
        </ScrollView>
      </Modal>

      <FAB
        icon="add"
        label="Add Time"
        extended={isFabExtended}
        onPress={() => setAddTimeModalVisible(true)}
        className="absolute right-4 bottom-4"
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </View>
  );
}
