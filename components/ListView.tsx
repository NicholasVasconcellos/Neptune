import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
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
import { getData, updateData } from "../utils/backendData";
import { alertLog } from "../utils/alertLog";

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
  const label = displayName ?? tableName;
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [fkLookups, setFkLookups] = useState<
    Record<string, Record<number, string>>
  >({});

  const [modalVisible, setModalVisible] = useState(false);
  const [modalColumn, setModalColumn] = useState("");
  const [modalRowId, setModalRowId] = useState<number | null>(null);
  const [modalOptions, setModalOptions] = useState<Record<string, any>[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [isFabExtended, setIsFabExtended] = useState(true);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleFormSuccess = useCallback((msg: string) => {
    setFabModalVisible(false);
    setSnackbarMessage(msg);
    setSnackbarVisible(true);
    fetchData();
  }, [fetchData]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getData(tableName);
      setData(rows);

      const fkColumns =
        rows.length > 0
          ? Object.keys(rows[0]).filter((col) => col in FK_TABLE_MAP)
          : [];

      const lookups: Record<string, Record<number, string>> = {};
      await Promise.all(
        fkColumns.map(async (col) => {
          try {
            const related = await getData(FK_TABLE_MAP[col]);
            const map: Record<number, string> = {};
            for (const item of related) {
              map[item.id] = item.Name ?? String(item.id);
            }
            lookups[col] = map;
          } catch {
            lookups[col] = {};
          }
        }),
      );
      setFkLookups(lookups);
    } catch (e: any) {
      alertLog("Error loading data", e.message);
    } finally {
      setLoading(false);
    }
  }, [tableName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  async function handleEmptyCellPress(column: string, rowId: number) {
    const relatedTable = FK_TABLE_MAP[column];
    if (!relatedTable) return;

    setModalColumn(column);
    setModalRowId(rowId);
    setModalVisible(true);
    setModalLoading(true);

    try {
      setModalOptions(await getData(relatedTable));
    } catch (e: any) {
      alertLog("Error loading options", e.message);
    } finally {
      setModalLoading(false);
    }
  }

  async function handleModalSelect(item: Record<string, any>) {
    if (modalRowId === null) return;

    try {
      await updateData(tableName, modalRowId, { [modalColumn]: item.id });
      setModalVisible(false);
      await fetchData();
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
    return (
      <View>
        <View className="flex-row flex-wrap px-4 py-3 gap-3">
          {columns.map((col) => (
            <View key={col} className="min-w-[80px] flex-1">
              <Text variant="label-sm" className="opacity-60 mb-0.5">
                {COLUMN_DISPLAY_NAMES[col] ?? col}
              </Text>
              {renderCell(col, item[col], item)}
            </View>
          ))}
        </View>
        <Divider />
      </View>
    );
  }

  if (loading) {
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
          loading={modalLoading}
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
