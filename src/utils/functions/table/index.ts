import { ParsedQs } from "qs";

export interface Filter {
  columnName: string;
  operation: string;
  value: string;
}

export interface Sorting {
  columnName: string;
  direction: "asc" | "desc";
}

export interface FilterOperations {
  [key: string]: string;
}

export interface SortObject {
  [key: string]: 1 | -1;
}

export type MongoQuery = {
  [key: string]: {
    [key: string]: string | number | RegExp;
  };
};

export const operations: Record<string, string> = {
  "<>": "$ne",
  "<": "$lt",
  "<=": "$lte",
  ">": "$gt",
  ">=": "$gte",
  equal: "$eq",
  contains: "$regex",
  between: "between", // This will be handled specially
  startswith: "$regex",
  endswith: "$regex",
  notcontains: "$not",
};

export const buildFilterQuery = (filters: Filter[]) => {
  const query: MongoQuery = {};

  filters.forEach((filter) => {
    const { columnName, operation, value } = filter;
    const mongoOperator = operations[operation];

    if (mongoOperator) {
      switch (operation) {
        case "equal":
          query[columnName] = { [mongoOperator]: value };
          break;

        case "between":
          const [start, end] = value.split(",").map((v) => parseFloat(v));
          query[columnName] = { $gte: start, $lte: end };
          break;

        case "contains":
        case "startswith":
        case "endswith":
          query[columnName] = { [mongoOperator]: new RegExp(value, "i") };
          break;

        case "notcontains":
          query[columnName] = { [mongoOperator]: new RegExp(value, "i") };
          break;

        default:
          throw new Error(`Nieobsługiwany operator: ${operation}`);
      }
    }
  });

  return query;
};

export const buildSortObject = (sortings: Sorting[]): SortObject => {
  const sortObject: SortObject = {};

  sortings.forEach((sort) => {
    const { columnName, direction } = sort;
    if (columnName && direction) {
      sortObject[columnName] = direction === "asc" ? 1 : -1;
    }
  });

  return sortObject;
};

export const parseQueryFilterArray = (
  queryArray: string | string[] | ParsedQs | ParsedQs[]
): Filter[] => {
  const result: Filter[] = [];

  const processedQueryArray = queryArray as string;

  for (let i = 0; i < processedQueryArray?.length; i += 3) {
    const columnName = processedQueryArray[i];
    const operation = processedQueryArray[i + 1];
    const value = processedQueryArray[i + 2];

    if (columnName && operation && value !== undefined) {
      result.push({ columnName, operation, value });
    }
  }

  return result;
};

export const parseQuerySortingArray = (
  queryArray: string | string[] | ParsedQs | ParsedQs[]
): Sorting[] => {
  const result: Sorting[] = [];

  const processedQueryArray = queryArray as string;

  for (let i = 0; i < processedQueryArray?.length; i += 3) {
    const columnName = processedQueryArray[i];
    const direction = processedQueryArray[i + 1] as "asc" | "desc";

    if (columnName && direction !== undefined) {
      result.push({ columnName, direction });
    }
  }

  return result;
};
