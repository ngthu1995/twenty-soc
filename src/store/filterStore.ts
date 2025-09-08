import { create } from "zustand";

export type FilterState = {
  severity: string;
  eventType: string;
  source: string;
  startDate: string;
  endDate: string;
};

interface Event {
  id: string;
  country: string;
  timestamp: string;
  severity: string;
  source: string;
  type: string;
}

interface Event {
  type: string;
  ids: (string | number)[];
}

interface FilterStore {
  activeFilterColumns: FilterState;
  setActiveFilterColumns: (state: FilterState) => void;
  selectedEvents: Event[];
  setSelectedEvents: (events: Event[]) => void;
  filteredEvents: Event[];
  setFilteredEvents: (events: Event[]) => void;
}

interface SetActiveFilterColumns {
  (state: FilterState): void;
}

interface SetSelectedEvents {
  (events: Event[]): void;
}

interface SetFilteredEvents {
  (events: Event[]): void;
}

const today = new Date();
const sixMonthsAgo = new Date(today);
sixMonthsAgo.setMonth(today.getMonth() - 6);
const formatDate = (date: Date) => date.toISOString().slice(0, 10);

export const defaultFilterState: FilterState = {
  severity: "",
  eventType: "",
  source: "",
  startDate: formatDate(sixMonthsAgo),
  endDate: formatDate(today),
};

export const useFilterStore = create<FilterStore>(
  (set: (partial: Partial<FilterStore>) => void) => ({
    activeFilterColumns: defaultFilterState,
    setActiveFilterColumns: (state: FilterState) =>
      set({ activeFilterColumns: state }),
    selectedEvents: [],
    setSelectedEvents: (events: Event[]) => set({ selectedEvents: events }),
    filteredEvents: [],
    setFilteredEvents: (events: Event[]) => set({ filteredEvents: events }),
  })
);
