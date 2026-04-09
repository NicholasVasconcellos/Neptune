import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { getData, onMutation } from "@/utils/backendData";

const CACHED_TABLES = ["Athletes", "Teams", "Times", "Trainings"] as const;
type CachedTable = (typeof CACHED_TABLES)[number];

interface DataContextType {
  athletes: Record<string, any>[];
  teams: Record<string, any>[];
  times: Record<string, any>[];
  trainings: Record<string, any>[];
  loading: boolean;
  refreshing: boolean;
  refreshAll: () => Promise<void>;
  refreshTable: (tableName: CachedTable) => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  athletes: [],
  teams: [],
  times: [],
  trainings: [],
  loading: true,
  refreshing: false,
  refreshAll: async () => {},
  refreshTable: async () => {},
});

export function DataProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();

  const [athletes, setAthletes] = useState<Record<string, any>[]>([]);
  const [teams, setTeams] = useState<Record<string, any>[]>([]);
  const [times, setTimes] = useState<Record<string, any>[]>([]);
  const [trainings, setTrainings] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const setterMap = useRef({
    Athletes: setAthletes,
    Teams: setTeams,
    Times: setTimes,
    Trainings: setTrainings,
  } as Record<CachedTable, React.Dispatch<React.SetStateAction<Record<string, any>[]>>>).current;

  const fetchAllTables = useCallback(async () => {
    const [a, te, ti, tr] = await Promise.all(
      CACHED_TABLES.map((t) => getData(t))
    );
    setAthletes(a);
    setTeams(te);
    setTimes(ti);
    setTrainings(tr);
  }, []);

  const refreshTable = useCallback(async (tableName: CachedTable) => {
    try {
      const rows = await getData(tableName);
      setterMap[tableName](rows);
    } catch {
      // getData handles error logging
    }
  }, [setterMap]);

  const refreshAll = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchAllTables();
    } catch {
      // getData handles error logging
    } finally {
      setRefreshing(false);
    }
  }, [fetchAllTables]);

  // Initial prefetch when session becomes available
  const hasFetched = useRef(false);
  useEffect(() => {
    if (!session) {
      setAthletes([]);
      setTeams([]);
      setTimes([]);
      setTrainings([]);
      setLoading(true);
      hasFetched.current = false;
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    fetchAllTables()
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session, fetchAllTables]);

  // Subscribe to mutation notifications — auto-refresh cached tables
  useEffect(() => {
    const cachedSet = new Set<string>(CACHED_TABLES);
    return onMutation((tableName) => {
      if (cachedSet.has(tableName)) {
        refreshTable(tableName as CachedTable);
      }
    });
  }, [refreshTable]);

  return (
    <DataContext.Provider
      value={{
        athletes,
        teams,
        times,
        trainings,
        loading,
        refreshing,
        refreshAll,
        refreshTable,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
