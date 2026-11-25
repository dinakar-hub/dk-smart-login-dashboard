import "./DataTable.css";

export default function DataTable({ columns, rows, getRowId, onRowClick, activeId, emptyMessage }) {
  return (
    <div className="table-wrap">
      <table className={`data-table${onRowClick ? " is-clickable" : ""}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" style={column.width ? { width: column.width } : undefined}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="data-table__empty" colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = getRowId(row);
              return (
                <tr
                  key={id}
                  className={activeId === id ? "is-active" : ""}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  aria-selected={activeId === id}
                >
                  {columns.map((column) => (
                    <td key={column.key}>{column.render ? column.render(row) : row[column.key]}</td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
