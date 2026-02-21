import { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import {
  Searchbar,
  ActivityIndicator,
  Divider,
  TouchableRipple,
  Text,
  AnimatedFAB,
  IconButton,
  Surface,
} from "react-native-paper";

import Typeahead from "./Typeahead";
import { getData, updateData } from "../utils/backendData";
import { alertLog } from "../utils/alertLog";

// Columns hidden from display by default
const SYSTEM_COLUMNS = ["id", "created_at", "User ID"];

// FK columns map to their related table name
const FK_TABLE_MAP: Record<string, string> = {
  "Team ID": "Teams",
  "Group ID": "Groups",
  "Athlete ID": "Athletes",
};

// Display labels for columns (overrides raw column names)
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

  // Lookup maps: FK column → { id → Name } for displaying names instead of IDs
  const [fkLookups, setFkLookups] = useState<Record<string, Record<number, string>>>({});

  // Inline-add modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [modalColumn, setModalColumn] = useState("");
  const [modalRowId, setModalRowId] = useState<number | null>(null);
  const [modalOptions, setModalOptions] = useState<Record<string, any>[]>([]);
  const [modalLoading, setModalLoading] = useState(false);

  // FAB modal state
  const [fabModalVisible, setFabModalVisible] = useState(false);
  const [isFabExtended, setIsFabExtended] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const rows = await getData(tableName);
      setData(rows);

      // Build lookup maps for FK columns found in the data
      const fkColumns = rows.length > 0
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
        })
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

  // Determine which columns to display
  const columns =
    displayColumns ??
    (data.length > 0
      ? Object.keys(data[0]).filter((col) => !SYSTEM_COLUMNS.includes(col))
      : []);

  // Filter rows by search query against the Name column
  const filteredData = searchQuery.trim()
    ? data.filter((row) => {
        const name = row["Name"];
        if (typeof name !== "string") return false;
        return name.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : data;

  // Handle tapping a populated cell (FK or Name)
  function handleCellPress(targetTable: string, id: any) {
    alertLog("Navigate", `${targetTable}/${id}`);
  }

  // Handle tapping an empty FK cell — open inline-add modal
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

  // Handle selecting an option in the inline-add modal
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

    // FK cell with no value — show "+" button
    if (isFK && (value === null || value === undefined)) {
      return (
        <IconButton
          icon="plus"
          size={16}
          onPress={() => handleEmptyCellPress(column, row.id)}
        />
      );
    }

    // FK cell with value — show related name, clickable with ID internally
    if (isFK && value !== null) {
      const displayName = fkLookups[column]?.[value] ?? String(value);
      return (
        <TouchableRipple
          onPress={() => handleCellPress(FK_TABLE_MAP[column], value)}
          style={styles.cellTouchable}
        >
          <Text variant="bodyMedium">{displayName}</Text>
        </TouchableRipple>
      );
    }

    // Name column — clickable, navigates to this table's object
    if (column === "Name" && value !== null && value !== undefined) {
      return (
        <TouchableRipple
          onPress={() => handleCellPress(tableName, row.id)}
          style={styles.cellTouchable}
        >
          <Text variant="bodyMedium">{String(value)}</Text>
        </TouchableRipple>
      );
    }

    // Regular cell
    return (
      <Text variant="bodyMedium" style={styles.cellText}>
        {value !== null && value !== undefined ? String(value) : "—"}
      </Text>
    );
  }

  function renderRow({ item }: { item: Record<string, any> }) {
    return (
      <View>
        <View style={styles.row}>
          {columns.map((col) => (
            <View key={col} style={styles.cell}>
              <Text variant="labelSmall" style={styles.cellLabel}>
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={`Search ${tableName} by name...`}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredData}
        renderItem={renderRow}
        keyExtractor={(item) => String(item.id)}
        onScroll={onFlatListScroll}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text variant="bodyMedium" style={styles.emptyText}>
            No results found
          </Text>
        }
      />

      {/* Inline-Add Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Surface style={styles.modalContent} elevation={4}>
            <View style={styles.modalHeader}>
              <Text variant="titleMedium">
                Select {FK_TABLE_MAP[modalColumn]}
              </Text>
              <IconButton
                icon="close"
                onPress={() => setModalVisible(false)}
              />
            </View>
            <Typeahead
              array={modalOptions}
              propertyName="Name"
              formTitle={`Search ${FK_TABLE_MAP[modalColumn]}`}
              placeholderText="Type to search..."
              loading={modalLoading}
              onSelect={handleModalSelect}
            />
          </Surface>
        </View>
      </Modal>

      {/* FAB Create Modal */}
      {createForm && (
        <Modal
          visible={fabModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFabModalVisible(false)}
        >
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <Surface style={styles.fabModalContent} elevation={4}>
              <View style={styles.modalHeader}>
                <Text variant="titleMedium">Add {tableName}</Text>
                <IconButton
                  icon="close"
                  onPress={() => setFabModalVisible(false)}
                />
              </View>
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {createForm}
              </ScrollView>
            </Surface>
          </KeyboardAvoidingView>
        </Modal>
      )}

      <AnimatedFAB
        icon="plus"
        label={`Add ${tableName}`}
        extended={isFabExtended}
        onPress={() => setFabModalVisible(true)}
        style={styles.fab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchbar: {
    margin: 12,
  },
  listContent: {
    paddingBottom: 80,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  cell: {
    minWidth: 80,
    flex: 1,
  },
  cellLabel: {
    opacity: 0.6,
    marginBottom: 2,
  },
  cellText: {},
  cellTouchable: {
    alignSelf: "flex-start",
    padding: 4,
    borderRadius: 4,
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
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 16,
    maxHeight: 400,
  },
  fabModalContent: {
    borderRadius: 16,
    padding: 16,
    maxHeight: "85%",
    flexShrink: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});
