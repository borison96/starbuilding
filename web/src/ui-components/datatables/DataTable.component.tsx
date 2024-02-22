import { memo } from "react";
import { DataTableProps, NodeTableData } from "../../typings";
import HeaderRow from "../commons/table/HeaderRow.component";
import './datatable.scss';

const DataTable = ({ data, meta, treeMeta, newColumn, newRow, appendColums, ...props }: DataTableProps<NodeTableData>) => {
    console.count('rendering datatable');
    const renderData = (d: any) => {
        if (typeof d === 'string') {
            return d;
        }
        return null;
    }
    const handleFocusOnEnter = (id: string, e: any) => {
        const target = document.getElementById(id);
        if (e?.key && e?.key?.toLowerCase() === 'enter' && target) {
          (target?.nextElementSibling?.querySelector('input:not(:read-only)') as HTMLElement)?.focus()
        }
    }
    const extraHeaders: { [key: string]: any; } = {};
    if (data?.length > 0) {
      data.forEach((d) => {
        if (d.tree?.children?.length) {
          d?.tree?.children?.forEach((v) => {
            if (v.name) extraHeaders[v.name] = v;
          })
        }
        if (d?.children?.length) {
          d?.children?.forEach((v) => {
            if (v.name) extraHeaders[v.name] = v;
          })
        }
      });
    }
    const newRows = [...Object.keys({...(meta ?? {}), ...(extraHeaders ?? {})}), ...appendColums, 'empty'];
    return data?.length > 0 ? (
        <div {...props} style={{ maxWidth: '100vw', overflow: 'auto', maxHeight: '20vh', overflowY: 'auto' }}>
          <table className="data-table-xx" style={{ borderCollapse: 'collapse', borderRadius: 5 }}>
            <thead>
              <HeaderRow>
                <>
                  {
                    Object.entries(meta).map(([k, d]) => <th key={k}>{d.displayName ?? k}</th>)
                  }
                  {
                   Object.keys(extraHeaders).map(v => <th style={{ textTransform: 'capitalize' }} key={v}>{v}</th>)
                  }
                  {
                   appendColums.map(v => <th style={{ textTransform: 'capitalize' }} key={v}>{v}</th>)
                  }
                  {
                    <th style={{ textAlign: 'center' }}>{newColumn.renderHeader()}</th>
                  }
                </>
              </HeaderRow>
            </thead>
            <tbody>
                {
                    data?.filter(f => f?.attributes?.nodeType !== 'empty')?.map((dt, idx) => (
                        <tr key={(dt?.id ?? dt?.attributes?.id)} id={dt?.id?.toString() ?? dt?.attributes?.id} onKeyDown={(e) => handleFocusOnEnter(dt?.id?.toString() ?? dt?.attributes?.id, e)}>
                            {
                                Object.entries(meta).map(([k, d]) => <td data-key={k} key={k}>{d.render ? d.render(dt, idx, extraHeaders) : renderData(dt[k as keyof NodeTableData]) }</td>)
                            }
                            {
                              Object.values(extraHeaders).map(v => {
                               if ((dt?.tree?.children && dt?.tree?.children.length > 1) || (dt?.children?.length > 0)) {
                                  const it = dt?.tree ? dt?.tree?.children?.find(f => f.name === v?.name) : dt?.children?.find(f => f.name === v?.name);
                                  if (it) return (
                                    <td data-key={it.name + (dt?.id ?? dt?.attributes?.id)} key={it.name + (dt?.id ?? dt?.attributes?.id)}>
                                      { treeMeta['status'] ? treeMeta['status']?.render(dt, it, idx) : treeMeta['data']?.render(dt, it, idx)}
                                    </td>
                                  );
                                  return <td data-key={(dt?.id ?? dt?.attributes?.id) + v?.name} key={(dt?.id ?? dt?.attributes?.id) + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                               } else {
                                 return <td key={(dt?.id ?? dt?.attributes?.id) + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                               }
                              })
                            }
                            {
                              appendColums.map(v => <td key={(dt?.id ?? dt?.attributes?.id) + v}>{ treeMeta['none']?.render(dt, { name: v }, idx) }</td>)
                            }
                            {
                              <td key={(dt?.id ?? dt?.attributes?.id) + 'new'}>{newColumn.renderData(idx)}</td>
                            }
                        </tr>
                    ))
                }
                {
                  newRow && (
                    <tr>
                      {
                          newRows.map((k, i) => <td key={k}>{newRow.render(k, i, newRows.length)}</td>)
                      }
                    </tr>
                  )
                }
            </tbody>
            <tfoot>
              <tr>
                {
                    newRows.map((k, i) => <td key={k}><span style={{ visibility: 'hidden', display: 'flex' }}>h</span></td>)
                }
              </tr>
            </tfoot>
          </table>
        </div> 
    ) : null;
};

export default memo(DataTable);
