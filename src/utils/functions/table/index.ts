import { ParsedQs } from "qs";

export interface Filter {
  columnName: string;
  operation: keyof typeof operations;
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

type MongoQueryValue = string | number | RegExp | boolean | Date | null;

interface MongoQuery {
  [key: string]:
    | MongoQueryValue
    | MongoQueryValue[]
    | { [key: string]: MongoQueryValue };
}

export const operations = {
  notEqual: "$ne",
  lessThan: "$lt",
  lessThanOrEqual: "$lte",
  greaterThan: "$gt",
  greaterThanOrEqual: "$gte",
  equal: "$eq",
  contains: "$regex",
  between: "between",
  startsWith: "$regex",
  endsWith: "$regex",
  notContains: "$not",
};

const numericColumns = ["surfaceArea", "pesel", "nip", "permitNo"];

const checkEqualValue = (
  columnName: string,
  value: string | number
): string | number | boolean | Date => {
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }

  if (!isNaN(+value) && numericColumns.includes(columnName)) {
    return +value;
  }

  if (columnName.toLocaleLowerCase().includes("date")) {
    return new Date(value);
  }

  return value;
};

export const buildFilterQuery = (filters: Filter[]) => {
  const query: MongoQuery = {};

  filters.forEach((filter) => {
    const { columnName, operation, value } = filter;
    const mongoOperator = operations[operation];

    const filterValue = checkEqualValue(columnName, value);

    if (!query[columnName]) {
      query[columnName] = {};
    }

    if (mongoOperator) {
      switch (operation) {
        case "equal":
          query[columnName] = {
            [mongoOperator]: filterValue,
          };
          break;

        case "notEqual":
          query[columnName] = { $ne: filterValue };
          break;

        case "greaterThanOrEqual":
          query[columnName] = { $gte: filterValue };
          break;

        case "lessThanOrEqual":
          query[columnName] = { $lte: filterValue };
          break;

        case "lessThan":
          query[columnName] = { $lt: filterValue };
          break;

        case "between":
          const [start, end] = value.split(",").map((v) => parseFloat(v));
          query[columnName] = {
            $gte: checkEqualValue(columnName, start),
            $lte: checkEqualValue(columnName, end),
          };
          break;

        case "contains":
        case "startsWith":
        case "endsWith":
          query[columnName] = { [mongoOperator]: new RegExp(value, "i") };
          break;

        case "notContains":
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
    const operation = processedQueryArray[i + 1] as keyof typeof operations;
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
