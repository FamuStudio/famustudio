import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { maxSelectionSize, services } from "@/lib/famu-data";

type SelectionContextValue = {
  selected: string[];
  count: number;
  toggle: (serviceName: string) => void;
  remove: (serviceName: string) => void;
  clear: () => void;
  isSelected: (serviceName: string) => boolean;
};

const STORAGE_KEY = "famu-studio-selection";
const SelectionContext = createContext<SelectionContextValue | null>(null);

function normalizeSelection(value: unknown) {
  if (!Array.isArray(value)) return [];
  const validNames = new Set(services.map((service) => service.shortTitle));
  return value.filter((item): item is string => typeof item === "string" && validNames.has(item)).slice(0, maxSelectionSize);
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setSelected(normalizeSelection(JSON.parse(saved)));
    } catch {
      setSelected([]);
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // Local storage can be unavailable in privacy-restricted contexts.
    }
  }, [selected]);

  const value = useMemo<SelectionContextValue>(() => ({
    selected,
    count: selected.length,
    toggle: (serviceName) => setSelected((current) => current.includes(serviceName) ? current.filter((item) => item !== serviceName) : current.length >= maxSelectionSize ? current : [...current, serviceName]),
    remove: (serviceName) => setSelected((current) => current.filter((item) => item !== serviceName)),
    clear: () => setSelected([]),
    isSelected: (serviceName) => selected.includes(serviceName),
  }), [selected]);

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSelection() {
  const context = useContext(SelectionContext);
  if (!context) throw new Error("useSelection must be used inside SelectionProvider");
  return context;
}
