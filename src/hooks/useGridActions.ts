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

export function useGridActions(gridName?: string) {
  console.log('useGridActions called with gridName:', gridName);
  const {
    data: gridActions = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["grid_actions", gridName],
    queryFn: () => gridName ? fetchGridActionsByGridName(gridName) : fetchAllGridActions(),
    enabled: !!gridName,
  });

  console.log('useGridActions result:', { gridName, gridActions, isLoading, error });

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
    const gridName = gridAction.grid?.display_name || gridAction.grid?.table_name || gridAction.grid?.key;
    if (!acc[gridName]) {
      acc[gridName] = [];
    }
    acc[gridName].push(gridAction);
    return acc;
  }, {} as Record<string, GridAction[]>);

  // Sort actions within each grid by order
  Object.keys(actionsByGrid).forEach(gridName => {
    actionsByGrid[gridName].sort((a, b) => a.order - b.order);
  });

  return {
    allGridActions,
    actionsByGrid,
    isLoading,
    error,
  };
} 