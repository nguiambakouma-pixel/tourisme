import { ReactNode } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

/* ── Column definition ─────────────────────────────────────────── */
export interface Column<T> {
  key: string;
  label: string;
  /** render cell value — if omitted, falls back to item[key] */
  render?: (item: T) => ReactNode;
  /** hide on mobile */
  mobileHide?: boolean;
  /** column grows to fill space */
  grow?: boolean;
}

interface AdminTableProps<T extends { id: number }> {
  columns: Column<T>[];
  items: T[];
  onEdit: (item: T) => void;
  onDelete: (id: number) => void;
  /** Optional image accessor for mobile card thumbnail */
  imageKey?: keyof T;
  /** Primary label accessor for mobile card */
  labelKey?: keyof T;
  /** Secondary label accessor for mobile card */
  subLabelKey?: keyof T;
}

/**
 * Responsive data table:
 * - Desktop: standard <table> layout
 * - Mobile: card-per-row with ALWAYS-VISIBLE edit + delete buttons
 */
export function AdminTable<T extends { id: number }>({
  columns,
  items,
  onEdit,
  onDelete,
  imageKey,
  labelKey,
  subLabelKey,
}: AdminTableProps<T>) {

  const editBtn = (item: T) => (
    <button
      onClick={() => onEdit(item)}
      title="Modifier"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-pale text-sky font-semibold text-xs hover:bg-sky hover:text-white transition-all duration-200 shrink-0"
    >
      <Pencil className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Modifier</span>
    </button>
  );

  const deleteBtn = (item: T) => (
    <button
      onClick={() => onDelete(item.id)}
      title="Supprimer"
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-500 font-semibold text-xs hover:bg-red-500 hover:text-white transition-all duration-200 shrink-0"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span className="hidden sm:inline">Supprimer</span>
    </button>
  );

  return (
    <>
      {/* ── DESKTOP TABLE (md+) ─────────────────────────────────── */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider"
                >
                  {col.label}
                </th>
              ))}
              <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/40 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-700">
                    {col.render ? col.render(item) : String((item as any)[col.key] ?? '')}
                  </td>
                ))}
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      title="Modifier"
                      className="p-2 rounded-lg text-slate-400 hover:text-sky hover:bg-sky-pale/60 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      title="Supprimer"
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── MOBILE CARDS (< md) ─────────────────────────────────── */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const imgSrc = imageKey ? String((item as any)[imageKey] ?? '') : '';
          const label  = labelKey  ? String((item as any)[labelKey]  ?? '') : `#${item.id}`;
          const sub    = subLabelKey ? String((item as any)[subLabelKey] ?? '') : '';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
            >
              {/* Top row: thumbnail + info + action buttons */}
              <div className="flex items-center gap-3">
                {imgSrc && (
                  <img
                    src={imgSrc}
                    alt={label}
                    className="w-14 h-14 object-cover rounded-xl shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">{label}</p>
                  {sub && <p className="text-slate-400 text-xs mt-0.5 truncate">{sub}</p>}
                </div>

                {/* Action buttons — ALWAYS VISIBLE on mobile */}
                <div className="flex items-center gap-2 shrink-0">
                  {editBtn(item)}
                  {deleteBtn(item)}
                </div>
              </div>

              {/* Extra info rows from non-hidden columns */}
              <div className="mt-3 pt-3 border-t border-slate-50 grid grid-cols-2 gap-x-4 gap-y-1.5">
                {columns
                  .filter((col) => !col.mobileHide && col.key !== (imageKey as string) && col.key !== (labelKey as string))
                  .map((col) => (
                    <div key={col.key}>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{col.label}</span>
                      <span className="text-xs text-slate-600 font-medium">
                        {col.render ? col.render(item) : String((item as any)[col.key] ?? '—')}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
