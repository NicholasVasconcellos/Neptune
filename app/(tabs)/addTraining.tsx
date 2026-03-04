import { StyleSheet, View, FlatList } from "react-native";
import { useState, useEffect, useCallback } from "react";
import {
  Text,
  ActivityIndicator,
  AnimatedFAB,
  Card,
  Divider,
  Searchbar,
} from "react-native-paper";

import Title from "../../components/Title";
import TrainingForm from "../../components/InputForms/TrainingForm";
import { getData } from "../../utils/backendData";

interface Training {
  id: number;
  Name: string | null;
  Notes: string | null;
  Team: number | null;
  Date: string | null;
  Days: string[] | null;
}

export default function AddTraining() {
  const [view, setView] = useState<"list" | "form">("list");

  // List state
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [teamsMap, setTeamsMap] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFabExtended, setIsFabExtended] = useState(true);

  const fetchTrainings = useCallback(async () => {
    setLoading(true);
    try {
      const [rows, teams] = await Promise.all([
        getData("Trainings"),
        getData("Teams"),
      ]);
      setTrainings(rows as Training[]);
      const map: Record<number, string> = {};
      for (const t of teams) map[t.id] = t.Name ?? String(t.id);
      setTeamsMap(map);
    } catch {
      // leave empty on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (view === "list") fetchTrainings();
  }, [view, fetchTrainings]);

  const filteredTrainings = searchQuery.trim()
    ? trainings.filter((t) =>
        t.Name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : trainings;

  const onFlatListScroll = ({ nativeEvent }: any) => {
    const y = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsFabExtended(y <= 0);
  };

  // ---- Form view ----------------------------------------------------------

  if (view === "form") {
    return (
      <TrainingForm
        onSubmit={() => setView("list")}
        onCancel={() => setView("list")}
      />
    );
  }

  // ---- Training list view -------------------------------------------------

  function renderTrainingCard({ item }: { item: Training }) {
    const days =
      Array.isArray(item.Days) && item.Days.length > 0
        ? item.Days.join(", ")
        : null;
    return (
      <Card style={styles.card} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium">{item.Name ?? "Untitled"}</Text>
          {item.Date ? (
            <Text variant="bodySmall" style={styles.meta}>
              {item.Date}
            </Text>
          ) : null}
          {item.Team !== null && teamsMap[item.Team] ? (
            <Text variant="bodySmall" style={styles.meta}>
              Team: {teamsMap[item.Team]}
            </Text>
          ) : null}
          {days ? (
            <Text variant="bodySmall" style={styles.meta}>
              {days}
            </Text>
          ) : null}
          {item.Notes ? (
            <Text
              variant="bodySmall"
              style={styles.notes}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.Notes}
            </Text>
          ) : null}
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <Title>Trainings</Title>

      <Searchbar
        placeholder="Search trainings..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchbar}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredTrainings}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderTrainingCard}
          onScroll={onFlatListScroll}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <Divider />}
          ListEmptyComponent={
            <Text variant="bodyMedium" style={styles.emptyText}>
              No trainings yet. Tap + to create one.
            </Text>
          }
        />
      )}

      <AnimatedFAB
        icon="plus"
        label="New Training"
        extended={isFabExtended}
        onPress={() => setView("form")}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: 12,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 12,
    paddingBottom: 90,
  },
  card: {
    marginBottom: 8,
  },
  meta: {
    opacity: 0.65,
    marginTop: 2,
  },
  notes: {
    marginTop: 6,
    opacity: 0.8,
    fontStyle: "italic",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    opacity: 0.6,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
  },
});
