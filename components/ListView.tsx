import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import {
  Text,
  SearchBar,
  FAB,
  Modal,
  IconButton,
  Divider,
} from "./ui";
import Typeahead from "./Typeahead";
import { getData, updateData } from "../utils/backendData";
import { alertLog } from "../utils/alertLog";

const SYSTEM_COLUMNS = ["id", "created_at", "User ID"];

const FK_TABLE_MAP: Record<string, string> = {
  "Team ID": "Teams",
  "Athlete ID": "Athletes",
};

const COLUMN_DISPLAY_NAMES: Record<string, string> = {
  "Athlete ID": "Swimmer",
};

interface ListViewProps {
  tableName: string;
  displayColumns?: string[];
  createForm?: React.ReactNode;
}

export default function ListView({
  tableName,
  displayColumns,
  createForm,
}: ListViewProps) {
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
    alertLog("Navigate", `${targetTable}/${id}`);
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
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4fc3f7" />
      </View>
    );
  }

  return (
    <View className="flex-1">
      <SearchBar
        placeholder={`Search ${tableName} by name...`}
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
          <Text className="text-center mt-10 opacity-60">
            No results found
          </Text>
        }
      />

      {/* Inline-Add Modal */}
      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={`Select ${FK_TABLE_MAP[modalColumn]}`}
      >
        <Typeahead
          array={modalOptions}
          propertyName="Name"
          formTitle={`Search ${FK_TABLE_MAP[modalColumn]}`}
          placeholderText="Type to search..."
          loading={modalLoading}
          onSelect={handleModalSelect}
        />
      </Modal>

      {/* FAB Create Modal */}
      <Modal
        visible={fabModalVisible}
        onClose={() => setFabModalVisible(false)}
        title={`Add ${tableName}`}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {createForm}
        </ScrollView>
      </Modal>

      <FAB
        icon="add"
        label={`Add ${tableName}`}
        extended={isFabExtended}
        onPress={() => setFabModalVisible(true)}
        className="absolute right-4 bottom-4"
      />
    </View>
  );
}
