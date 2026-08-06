import type { DataState } from "@/types/data-state";

export type PlayerRecord = Readonly<Record<string, never>>;
export type TeamRecord = Readonly<Record<string, never>>;
export type TournamentRecord = Readonly<Record<string, never>>;
export type MatchRecord = Readonly<Record<string, never>>;
export type ComplaintRecord = Readonly<Record<string, never>>;
export type IntegrityCaseRecord = Readonly<Record<string, never>>;

export interface PlayerRepository { list(): Promise<DataState<readonly PlayerRecord[]>>; findById(id: string): Promise<DataState<PlayerRecord | null>>; }
export interface TeamRepository { list(): Promise<DataState<readonly TeamRecord[]>>; }
export interface TournamentRepository { list(): Promise<DataState<readonly TournamentRecord[]>>; }
export interface MatchRepository { findById(id: string): Promise<DataState<MatchRecord | null>>; }
export interface ComplaintRepository { list(): Promise<DataState<readonly ComplaintRecord[]>>; }
export interface IntegrityCaseRepository { findById(id: string): Promise<DataState<IntegrityCaseRecord | null>>; }
