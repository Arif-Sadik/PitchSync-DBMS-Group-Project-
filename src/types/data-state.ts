export type DataStatus = "loading" | "empty" | "error" | "backend-unavailable" | "ready";

export type DataState<T> = {
  status: DataStatus;
  data: T;
  message?: string;
};
