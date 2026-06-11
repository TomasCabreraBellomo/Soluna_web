export function AdminTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-soluna-nude bg-white shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-soluna-ivory text-xs uppercase tracking-[0.14em] text-soluna-charcoal/55">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-5 py-4 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-soluna-nude/70">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-5 py-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
