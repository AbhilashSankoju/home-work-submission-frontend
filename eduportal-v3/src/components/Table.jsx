export default function Table({ columns, data, emptyMessage = 'No records found.' }) {
  return (
    <div className="tbl-wrap">
      <table className="tbl">
        <thead>
          <tr>{columns.map(c => <th key={c.key}>{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0
            ? <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '3rem', color: '#8a9ab0', fontFamily: 'Lato' }}>{emptyMessage}</td></tr>
            : data.map((row, i) => (
              <tr key={row.id ?? i}>
                {columns.map(c => <td key={c.key}>{c.render ? c.render(row) : (row[c.key] ?? '—')}</td>)}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
