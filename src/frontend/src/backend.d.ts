import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Entry {
    propertyType: string;
    totalValue: number;
    east: number;
    unit: string;
    west: number;
    totalArea: number;
    roomsCount: bigint;
    south: number;
    north: number;
    timestamp: Time;
    unitRate: number;
}
export type Time = bigint;
export interface backendInterface {
    addEntry(propertyType: string, east: number, west: number, north: number, south: number, unit: string, unitRate: number, roomsCount: bigint, totalArea: number, totalValue: number): Promise<bigint>;
    clearEntries(): Promise<void>;
    getAllEntries(): Promise<Array<Entry>>;
}
