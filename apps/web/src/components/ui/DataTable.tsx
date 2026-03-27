import { ReactNode } from "react";
import { Card } from "./Card";

interface Column<T> {
  header: string;
  key: keyof T;
  align?: "left" | "right" | "center";
  render?: (value: unknown, row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Array<Column<T>>;
  rows: T[];
  title?: string;
}

export function DataTable<T extends object>({ columns, rows, title }: DataTableProps<T>) {
  return (
    <Card className="overflow-hidden p-0">
      {title && <div className="border-b border-slate-200 px-5 py-4 text-lg font-semibold text-slate-900">{title}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  className={`whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                    column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                  }`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100 transition hover:bg-slate-50/70">
                {columns.map((column) => {
                  const value = (row as Record<string, unknown>)[String(column.key)];
                  return (
                    <td
                      key={column.header}
                      className={`whitespace-nowrap px-5 py-4 text-sm text-slate-700 ${
                        column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {column.render ? column.render(value, row) : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
