import { useQuery } from "@tanstack/react-query";
import { fetchGridDefinitions, fetchGridSections } from "./supabaseClient";
import React from "react";

export function useGridConfig() {
  // Fetch grid definitions and sections
  const {
    data: gridDefs = [],
    isLoading: defsLoading,
    error: defsError,
  } = useQuery({
    queryKey: ["grid_definitions"],
    queryFn: fetchGridDefinitions,
    initialData: [],
  });
  const {
    data: gridSections = [],
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useQuery({
    queryKey: ["grid_sections"],
    queryFn: fetchGridSections,
    initialData: [],
  });

  // Build mappings
  const groupKeyToSection = React.useMemo(() => {
    const map: Record<string, any> = {};
    gridSections.forEach((section: any) => {
      map[section.key] = section;
    });
    return map;
  }, [gridSections]);

  const gridKeyToGroup = React.useMemo(() => {
    const map: Record<string, string> = {};
    gridDefs.forEach((grid: any) => {
      map[grid.table_name || grid.key] = grid.group;
    });
    return map;
  }, [gridDefs]);

  const groupKeyToGrids = React.useMemo(() => {
    const map: Record<string, any[]> = {};
    gridDefs.forEach((grid: any) => {
      const group = grid.group;
      if (!map[group]) map[group] = [];
      map[group].push(grid);
    });
    return map;
  }, [gridDefs]);

  // Sorted group keys by order
  const sortedGroupKeys = React.useMemo(() => {
    return Object.keys(groupKeyToSection).sort((a, b) => {
      const orderA = groupKeyToSection[a]?.order ?? 9999;
      const orderB = groupKeyToSection[b]?.order ?? 9999;
      return orderA - orderB;
    });
  }, [groupKeyToSection]);

  // Loading and error state
  const isLoading = defsLoading || sectionsLoading;
  const error = defsError || sectionsError;

  return {
    gridDefs,
    gridSections,
    groupKeyToSection,
    gridKeyToGroup,
    groupKeyToGrids,
    sortedGroupKeys,
    isLoading,
    error,
  };
} 