import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DataTableProps, KnowledgeNodeDatum } from "../../typings";
import ExportToExcelButton from "../button/ExportToExcelButton.component";
import DraggableTableRow from "../commons/table/DraggableTableRow.component";
import { DropRawTarget } from "../commons/table/DropRowTarget.component";
import HeaderRow from "../commons/table/HeaderRow.component";
import { DragKnowledgeNodeItemType } from "../drag-n-drop";
import './datatable.scss';

const TreeDataTable = ({ data, meta, treeMeta, newColumn, newRow, appendColums, caption, groupId, handleDropItem, ...props }: DataTableProps<KnowledgeNodeDatum>) => {
    const [extraHeaders, setExtraHeaders] = useState<{ [key: string]: any; }>({});
    const tableRef = useRef();
    const { t } = useTranslation();
    const renderData = (d: any) => {
        if (typeof d === 'string') {
            return d;
        }
        return null;
    }
    const handleFocusOnEnter = (id: string, e: any) => {
        const target = document.getElementById(`tree-data-table-${id}`);
        if (e?.key && (e?.key?.toLowerCase() === 'enter' || e?.key?.toLowerCase() === 'arrowdown') && target) {
          (target?.nextElementSibling?.querySelector('input:not(:read-only)') as HTMLElement)?.focus()
        }
    }
    useEffect(() => {
      if (data?.length > 0) {
        const extras: { [key: string]: any; } = {};
        data.forEach((d) => {
          if (d?.children?.length) {
            d?.children?.forEach((v) => {
              if (v.name) extras[v.name] = v;
            })
          }
        });
        setExtraHeaders(extras);
      }
    }, [data]);
    const getTableRef = () => tableRef.current;
    const newRows = [...Object.keys({...(meta ?? {}), ...(extraHeaders ?? {})}), ...appendColums, 'empty'];

    const handleDropItemLocal = (item?: DragKnowledgeNodeItemType, target?: number | string ) => {
      if (typeof handleDropItem === 'function') {
          handleDropItem(item, target);
      }
    }
    return (
        <div {...props} style={{ maxWidth: '100vw', overflow: 'auto', overflowY: 'auto' }}>
          <div>
            <details style={{ width: '100%' }} open>
              <summary>
                <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <span style={{ padding: 2 }}>{caption}</span>
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
              </summary>
              {
                    data?.length > 0 ? (
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
                                          data?.filter(f => f?.attributes?.nodeType !== 'empty')?.map((dt, idx) => (
                                              <DraggableTableRow
                                                dragItem={{ name: dt?.name, groupId, ...(dt?.attributes ?? {}) }}
                                                key={(dt?.attributes?.id?.toString() ?? dt?.name)}
                                                id={`tree-data-table-${dt?.attributes?.id?.toString() ?? dt?.name}`}
                                                onKeyDown={(e) => handleFocusOnEnter(dt?.attributes?.id?.toString() ?? dt?.name, e)}
                                              >
                                                  {
                                                      Object.entries(meta).map(([k, d]) => <td data-key={k} key={k}>{d.render ? d.render(dt, idx) : renderData(dt[k as keyof KnowledgeNodeDatum]) }</td>)
                                                  }
                                                  {
                                                    Object.values(extraHeaders).map(v => {
                                                    if (dt?.children?.length > 0) {
                                                        const it = dt?.children?.find(f => f.name === v?.name);
                                                        if (it) return (
                                                          <td data-key={it.name + dt?.attributes?.id} key={it.name + dt?.attributes?.id}>
                                                            { treeMeta['status'] ? treeMeta['status']?.render(dt, it, idx) : treeMeta['data']?.render(dt, it, idx)}
                                                          </td>
                                                        );
                                                        return <td data-key={dt?.attributes?.id + v?.name} key={dt?.attributes?.id + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                                                    } else {
                                                      return <td key={dt?.attributes?.id + v?.name}>{ treeMeta['none']?.render(dt, v, idx) }</td>
                                                    }
                                                    })
                                                  }
                                                  {
                                                    appendColums.map(v => <td key={dt?.attributes?.id + v}>{ treeMeta['none']?.render(dt, { name: v }, idx) }</td>)
                                                  }
                                                  {
                                                    <td key={dt?.attributes?.id + 'new'}>{newColumn.renderData(idx)}</td>
                                                  }
                                              </DraggableTableRow>
                                          ))
                                      }
                                      {
                                        newRow && (
                                          <DropRawTarget
                                            target={groupId}
                                            style={{ border: '1.5px solid transparent' }}
                                            element="tr"
                                            onDrop={handleDropItemLocal}
                                          >
                                              <td role="representation" />
                                              {
                                                  newRows.map((k, i) => <td key={k}>{newRow.render(k, i, newRows.length)}</td>)
                                              }
                                          </DropRawTarget>
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
                    ) : null
                  }
            </details>
          </div>
        </div> 
    );
};

export default TreeDataTable;
