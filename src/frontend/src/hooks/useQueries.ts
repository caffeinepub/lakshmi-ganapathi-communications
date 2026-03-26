import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Entry } from "../backend.d";
import { useActor } from "./useActor";

export type { Entry };

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();
  return useQuery<Entry[]>({
    queryKey: ["entries"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (entry: {
      propertyType: string;
      east: number;
      west: number;
      north: number;
      south: number;
      unit: string;
      unitRate: number;
      roomsCount: bigint;
      totalArea: number;
      totalValue: number;
    }) => {
      if (!actor) throw new Error("Actor not available");
      return actor.addEntry(
        entry.propertyType,
        entry.east,
        entry.west,
        entry.north,
        entry.south,
        entry.unit,
        entry.unitRate,
        entry.roomsCount,
        entry.totalArea,
        entry.totalValue,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}

export function useClearEntries() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.clearEntries();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });
}
