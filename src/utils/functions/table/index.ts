import { ParsedQs } from "qs";

export const operations: Record<string, string> = {
  "=": "$eq",
  "<>": "$ne",
  "<": "$lt",
  "<=": "$lte",
  ">": "$gt",
  ">=": "$gte",
  contains: "$regex",
  between: "between", // This will be handled specially
  startswith: "$regex",
  endswith: "$regex",
  notcontains: "$not",
};

// Function to build the filter query based on filters
export const buildFilterQuery = (filters: any[]) => {
  const query: any = {};
  filters.forEach((filter) => {
    const { columnName, operation, value } = filter;
    const mongoOperator = operations[operation];
    if (mongoOperator) {
      if (mongoOperator === "between") {
        const [start, end] = value.split(",").map((v: string) => parseFloat(v));
        query[columnName] = { $gte: start, $lte: end };
      } else if (mongoOperator === "$regex") {
        query[columnName] = { [mongoOperator]: new RegExp(value, "i") }; // Case-insensitive regex
      } else {
        query[columnName] = { [mongoOperator]: parseFloat(value) || value };
      }
    }
  });
  return query;
};

// Function to build the sort object based on sorting parameters
export const buildSortObject = (
  sort: { columnName: string; direction: "asc" | "desc" }[]
) => {
  return sort.map(
    ({ columnName, direction }) =>
      [columnName, direction === "desc" ? -1 : 1] as [string, 1 | -1]
  );
};

export const parseQueryArray = (queryArray: string[]) => {
  const result: any[] = [];
  for (let i = 0; i < queryArray.length; i += 3) {
    result.push({
      columnName: queryArray[i],
      operation: queryArray[i + 1],
      value: queryArray[i + 2],
    });
  }
  return result;
};
