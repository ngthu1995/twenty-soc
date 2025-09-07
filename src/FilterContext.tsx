import React, { createContext, useContext, useState, ReactNode } from "react";

type FilterState = {
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

type FilterContextType = {
  activeFilterColumns: FilterState;
  setActiveFilterColumns: React.Dispatch<React.SetStateAction<FilterState>>;
  selectedEvents: Event[];
  setSelectedEvents: React.Dispatch<React.SetStateAction<any[]>>;
  filteredEvents: Event[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<any[]>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

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

export const FilterProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeFilterColumns, setActiveFilterColumns] =
    useState<FilterState>(defaultFilterState);

  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);

  return (
    <FilterContext.Provider
      value={{
        activeFilterColumns,
        setActiveFilterColumns,
        filteredEvents,
        setFilteredEvents,
        selectedEvents,
        setSelectedEvents,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = (): FilterContextType => {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used inside FilterProvider");
  return ctx;
};
