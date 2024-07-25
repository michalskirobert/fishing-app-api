export type OptionProps<T = string, K = string> = { label: T; value: K };
export type DataTableProps<T> = { items: T[]; totalItems: number };
export type RequestProps<T> = T & { id: string };
