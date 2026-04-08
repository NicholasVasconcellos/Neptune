import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
  RefreshControl,
} from "react-native";
import {
  Text,
  SearchBar,
  FAB,
  Modal,
  IconButton,
  Divider,
  Snackbar,
  LoadingIndicator,
  EmptyState,
} from "./ui";
import Typeahead from "./Typeahead";
import { useRouter } from "expo-router";
import { updateData } from "@/utils/backendData";
import { useData } from "@/context/DataContext";
import { alertLog } from "@/utils/alertLog";

const SYSTEM_COLUMNS = ["id", "created_at", "User ID"];

const FK_TABLE_MAP: Record<string, string> = {
  "Team ID": "Teams",
  "Athlete ID": "Athletes",
};

const FK_DISPLAY_NAMES: Record<string, string> = {
  "Team ID": "Groups",
};

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  "Athlete ID": "Swimmer",
  "Team ID": "Group",
};

interface ListViewProps {
  tableName: string;
  displayName?: string;
  displayColumns?: string[];
  createForm?: React.ReactNode;
}

export default function ListView({
  tableName,
  displayName,
  displayColumns,
  createForm,
}: ListViewProps) {
  const router = useRouter();
  const cache = useData();
  const label = displayName ?? tableName;
  const [searchQuery, setSearchQuery] = useState("");

  const TABLE_KEY_MAP: Record<string, keyof typeof cache> = {
    Athletes: "athletes",
    Teams: "teams",
    Times: "times",
    Trainings: "trainings",
  };

  const data = (cache[TABLE_KEY_MAP[tableName] as keyof typeof cache] ?? []) as Record<string, any>[];

  const fkLookups = useMemo(() => {
    const lookups: Record<string, Record<number, string>> = {};
    const fkColumns =
      data.length > 0
        ? Object.keys(data[0]).filter((col) => col in FK_TABLE_MAP)
        : [];
    for (const col of fkColumns) {
      const related = (cache[TABLE_KEY_MAP[FK_TABLE_MAP[col]] as keyof typeof cache] ?? []) as Record<string, any>[];
      const map: Record<number, string> = {};
      for (const item of related) {
        map[item.id] = item.Name ?? String(item.id);
      }
      lookups[col] = map;
    }
    return lookups;
  }, [data, cache.teams, cache.athletes]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalColumn, setModalColumn] = useState("");
  const [modalRowId, setModalRowId] = useState<number | null>(null);

  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [isFabExtended, setIsFabExtended] = useState(true);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSuccess = useCallback((msg: string) => {
    setFabModalVisible(false);
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
  }, []);

  const columns =
    displayColumns ??
    (data.length > 0
      ? Object.keys(data[0]).filter((col) => !SYSTEM_COLUMNS.includes(col))
      : []);

  const filteredData = searchQuery.trim()
    ? data.filter((row) => {
        const name = row["Name"];
        if (typeof name !== "string") return false;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : data;

  function handleCellPress(targetTable: string, id: any) {
    if (targetTable === "Athletes") {
      router.push(`/athlete/${id}`);
    } else {
      alertLog("Navigate", `${targetTable}/${id}`);
    }
  }

  function handleEmptyCellPress(column: string, rowId: number) {
    const relatedTable = FK_TABLE_MAP[column];
    if (!relatedTable) return;

    setModalColumn(column);
    setModalRowId(rowId);
    setModalVisible(true);
  }

  const modalOptions = useMemo(() => {
    if (!modalColumn) return [];
    const relatedTable = FK_TABLE_MAP[modalColumn];
    if (!relatedTable) return [];
    return (cache[TABLE_KEY_MAP[relatedTable] as keyof typeof cache] ?? []) as Record<string, any>[];
  }, [modalColumn, cache.teams, cache.athletes]);

  async function handleModalSelect(item: Record<string, any>) {
    if (modalRowId === null) return;

    try {
      await updateData(tableName, modalRowId, { [modalColumn]: item.id });
      setModalVisible(false);
    } catch (e: any) {
      alertLog("Error updating", e.message);
    }
  }

  const onFlatListScroll = ({ nativeEvent }: any) => {
    const currentScrollPosition =
      Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsFabExtended(currentScrollPosition <= 0);
  };

  function renderCell(column: string, value: any, row: Record<string, any>) {
    const isFK = column in FK_TABLE_MAP;

    if (isFK && (value === null || value === undefined)) {
      return (
        <IconButton
          icon="add-circle-outline"
          size={16}
          onPress={() => handleEmptyCellPress(column, row.id)}
        />
      );
    }

    if (isFK && value !== null) {
      const displayName = fkLookups[column]?.[value] ?? String(value);
      return (
        <Pressable
          onPress={() => handleCellPress(FK_TABLE_MAP[column], value)}
          className="self-start p-1 rounded"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
        >
          <Text>{displayName}</Text>
        </Pressable>
      );
    }

    if (column === "Name" && value !== null && value !== undefined) {
      return (
        <Pressable
          onPress={() => handleCellPress(tableName, row.id)}
          className="self-start p-1 rounded"
          style={({ pressed }) => (pressed ? { opacity: 0.7 } : undefined)}
        >
          <Text>{String(value)}</Text>
        </Pressable>
      );
    }

    return (
      <Text>{value !== null && value !== undefined ? String(value) : "\u2014"}</Text>
    );
  }

  function renderRow({ item }: { item: Record<string, any> }) {
    const isRowTappable = tableName === "Athletes";
    const RowWrapper = isRowTappable ? Pressable : View;
    const rowProps = isRowTappable
      ? {
          onPress: () => handleCellPress(tableName, item.id),
          style: ({ pressed }: { pressed: boolean }) =>
            pressed ? { opacity: 0.7 } : undefined,
        }
      : {};

    return (
      <View>
        <RowWrapper {...(rowProps as any)} className="flex-row flex-wrap px-4 py-3 gap-3">
          {columns.map((col) => (
            <View key={col} className="min-w-[80px] flex-1">
              <Text variant="label-sm" className="opacity-60 mb-0.5">
                {COLUMN_DISPLAY_NAMES[col] ?? col}
              </Text>
              {renderCell(col, item[col], item)}
            </View>
          ))}
        </RowWrapper>
        <Divider />
      </View>
    );
  }

  if (cache.loading) {
    return <LoadingIndicator />;
  }

  return (
    <View className="flex-1">
      <SearchBar
        placeholder={`Search ${label} by name...`}
        onChangeText={setSearchQuery}
        value={searchQuery}
      />

      <FlatList
        data={filteredData}
        renderItem={renderRow}
        keyExtractor={(item) => String(item.id)}
        onScroll={onFlatListScroll}
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={cache.refreshing}
            onRefresh={cache.refreshAll}
          />
        }
        ListEmptyComponent={
          <EmptyState message="No results found" icon="search-outline" />
        }
      />

      {/* Inline-Add Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Select ${FK_DISPLAY_NAMES[modalColumn] ?? FK_TABLE_MAP[modalColumn]}`}
      >
        <Typeahead
          array={modalOptions}
          propertyName="Name"
          formTitle={`Search ${FK_DISPLAY_NAMES[modalColumn] ?? FK_TABLE_MAP[modalColumn]}`}
          placeholderText="Type to search..."
          onSelect={handleModalSelect}
        />
      </Modal>

      {/* FAB Create Modal */}
      <Modal
        visible={fabModalVisible}
        onClose={() => setFabModalVisible(false)}
        title={`Add ${label}`}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          {React.isValidElement(createForm)
            ? React.cloneElement(createForm as React.ReactElement<any>, {
                onSuccess: handleFormSuccess,
              })
            : createForm}
        </ScrollView>
      </Modal>

      <FAB
        icon="add"
        label={`Add ${label}`}
        extended={isFabExtended}
        onPress={() => setFabModalVisible(true)}
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
