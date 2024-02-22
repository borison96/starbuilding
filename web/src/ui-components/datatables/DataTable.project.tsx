import { t } from "i18next";
import { useRef } from "react";
import { memo } from "react";
import { DataTableProps } from "../../typings";
import { ProjectDetails } from "../../typings/api";
import ExportToExcelButton from "../button/ExportToExcelButton.component";
import DraggableTableRow from "../commons/table/DraggableTableRow.component";
import HeaderRow from "../commons/table/HeaderRow.component";
import './datatable.scss';

const DataTable = ({ data, meta, treeMeta, newColumn, newRow, appendColums, caption, groupId, ...props }: DataTableProps<ProjectDetails>) => {
    const tableRef = useRef();
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
    const getTableRef = () => tableRef.current;
    const extraHeaders: { [key: string]: any; } = {};
    if (data?.length > 0) {
      data.forEach((d) => {
        if (d.tree?.children?.length) {
          d?.tree?.children?.forEach((v) => {
            if (v.name) extraHeaders[v.name] = v;
          })
        }
      });
    }
    const newRows = [...Object.keys({...(meta ?? {}), ...(extraHeaders ?? {})}), ...appendColums, 'empty'];
    return data?.length > 0 ? (
        <div {...props} style={{ maxWidth: '100vw', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{caption}</span>
            <ExportToExcelButton
              getRef={getTableRef}
              fileName={caption}
              icon={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ height: 20, width: 20, background: '#888', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 5 }}>
                    <svg style={{ height: 20, width: 20 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137">
                        <path d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="scale(0.5) translate(1, 5)" fill="#fff" fillRule="evenodd"/>
                    </svg>
                  </span>
                  {t('export')}
                </span>
              }
            />
          </div>
          <table ref={tableRef} className="data-table-xx" style={{ borderCollapse: 'collapse', borderRadius: 5 }}>
            <thead>
              <HeaderRow>
                <>
                  <th role="representation" />
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
                    data?.filter(f => f?.tree?.attributes?.nodeType !== 'empty')?.map((dt, idx) => (
                        <DraggableTableRow 
                          dragItem={{ name: dt?.tree?.name, groupId, ...(dt.tree?.attributes ?? {}) }}
                          key={(dt?.id ?? dt?.tree?.attributes?.id?.toString())}
                          id={dt?.id?.toString() ?? dt?.tree?.attributes?.id?.toString()}
                          onKeyDown={(e) => handleFocusOnEnter(dt?.id?.toString() ?? dt?.tree?.attributes?.id?.toString(), e)}
                        >
                            {
                                Object.entries(meta).map(([k, d]) => <td data-key={k} key={k}>{d.render ? d.render(dt, idx, extraHeaders) : renderData(dt[k as keyof ProjectDetails]) }</td>)
                            }
                            {
                              Object.values(extraHeaders).map(v => {
                               if (dt?.tree?.children.length > 1) {
                                  const it = dt?.tree?.children?.find(f => f.name === v?.name);
                                  if (it) return (
                                    <td data-key={it.name + (dt?.id ?? dt?.tree?.attributes?.id)} key={it.name + (dt?.id ?? dt?.tree?.attributes?.id)}>
                                      { treeMeta['status'] ? treeMeta['status']?.render(dt, it, idx) : treeMeta['data']?.render(dt, it, idx)}
                                    </td>
                                  );
                                  return <td data-key={(dt?.id ?? dt?.tree?.attributes?.id) + v?.name} key={(dt?.id ?? dt?.tree?.attributes?.id) + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                               } else {
                                 return <td key={(dt?.id ?? dt?.tree?.attributes?.id) + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                               }
                              })
                            }
                            {
                              appendColums.map(v => <td key={(dt?.id ?? dt?.tree?.attributes?.id) + v}>{ treeMeta['none']?.render(dt, { name: v }, idx) }</td>)
                            }
                            {
                              <td key={(dt?.id ?? dt?.tree?.attributes?.id) + 'new'}>{newColumn.renderData(idx)}</td>
                            }
                        </DraggableTableRow>
                    ))
                }
                {
                  newRow && (
                    <tr>
                      <td role="representation" />
                      {
                          newRows.map((k, i) => <td key={k}>{newRow.render(k, i, newRows.length)}</td>)
                      }
                    </tr>
                  )
                }
            </tbody>
            <tfoot>
              <tr>
                <td role="representation" />
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
