import { useQuery } from "@tanstack/react-query";
import { fetchGridActionsByGridName, fetchAllGridActions } from "@/lib/supabaseClient";

export interface GridAction {
  id: string;
  grid_id: string;
  action_id: string;
  order: number;
  action: {
    id: string;
    name: string;
    label: string;
    icon: string;
    tooltip: string;
    description: string;
  };
  grid?: {
    display_name: string;
    table_name: string;
    key: string;
  };
}

export function useGridActions(gridKey?: string) {

  const {
    data: gridActions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["grid_actions", gridKey],
    queryFn: () => gridKey ? fetchGridActionsByGridName(gridKey) : fetchAllGridActions(),
    enabled: !!gridKey,
  });



  // Sort actions by order
  const sortedActions = gridActions.sort((a, b) => a.order - b.order);

  return {
    gridActions: sortedActions,
    isLoading,
    error,
  };
}

export function useAllGridActions() {
  const {
    data: allGridActions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all_grid_actions"],
    queryFn: fetchAllGridActions,
  });

  // Group actions by grid
  const actionsByGrid = allGridActions.reduce((acc, gridAction) => {
    const gridKey = gridAction.grid?.display_name || gridAction.grid?.table_name || gridAction.grid?.key;
    if (!acc[gridKey]) {
      acc[gridKey] = [];
    }
    acc[gridKey].push(gridAction);
    return acc;
  }, {} as Record<string, GridAction[]>);

  // Sort actions within each grid by order
  Object.keys(actionsByGrid).forEach(gridKey => {
    actionsByGrid[gridKey].sort((a, b) => a.order - b.order);
  });

  return {
    allGridActions,
    actionsByGrid,
    isLoading,
    error,
  };
} 