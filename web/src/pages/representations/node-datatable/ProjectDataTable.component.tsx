import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "../../../hooks";
import { setKanbanViewType, setScrollId } from "../../../services/redux/reducers/kanban/kanban.slice";
import { addNodeToTree, updateTreeNode } from "../../../services/redux/reducers/project/knowledge-tree.slice";
import { updateProject } from "../../../services/redux/reducers/project/projects.slice";
import { enableRepresentation } from "../../../services/redux/reducers/representation/representation.slice";
import { selectProject, setActiveNode, setActiveNodePath } from "../../../services/redux/reducers/tree-node/treeNode.slice";
import { ProjectDetails } from "../../../typings/api";
import Progress from "../../../ui-components/commons/progress/Progress.component";
import { DropdownSelectCell, EditableCell } from "../../../ui-components/commons/table";
import { InputButton } from "../../../ui-components/controls/button/InputButton.component";
import DataTable from "../../../ui-components/datatables/DataTable.project";
import CirclePlusIcon from "../../../ui-components/icons/CirclePlus.icon";
import EyeOpenIcon from "../../../ui-components/icons/EyeOpen.icon";
import { getNodeCompletionRate, getStatus, selectTreeNode } from "../../../utils";
const ProjectDataTable = ({ onNewRowClick }: { onNewRowClick?: (prop: any) => void}) => {
    const { t } = useTranslation();
    const projects = useSelector(state => state.projects.payload);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const activeProject = useSelector(state => state.treeNode.project);
    const statusOptions = useSelector(state => state.projectNodeStatuses.payload);
    const organisation = useSelector(state => state.organisation);
    const [newColumnClick, setNewColumnClick] = useState(false);
    const [names, setNames] = useState<{ [key: string]: string}>({});
    const [newColumnName, setNewColumnName] = useState('');
    const [newColumns, setNewColumns] = useState<Array<string>>([]);
    const dispatch = useDispatch();
    const handleAddNewNode = ({ id, node}: {id: any; node: any;}) => {
        dispatch(addNodeToTree({id, node: {
            description: node?.attributes?.description,
            name: node?.name,
            nodeType: node?.attributes?.nodeType ?? 'libre',
            parentNodeId: node?.parentNodeId,
            data: node?.data,
        }
        })).unwrap().then(() => {
            const idx = newColumns?.findIndex(f => f === node.name);
            if (idx > -1) {
                // remove the column
                const aa = [ ...newColumns ];
                aa.splice(idx, 1);
                setNewColumns(aa);
            }
        });
    }
    const handleBlurNewColumn = (name: string) => {
        setNewColumnName(name);
        setNewColumnClick(false);
    }
    const handleAddNewColumn = (name: string) => {
        if (name?.trim()) {
            setNewColumns([ ...newColumns, name ]);
            setNewColumnName('');
        }
        setNewColumnClick(false);
    }
    const handleNewRowClick = (e: any) => {
        if (onNewRowClick) {
            onNewRowClick(e);
        }
    }
    const handleUpdateCell = ({ id, node }: { id: string | number; node: any;}) => {
        dispatch(updateTreeNode({ id, node }));
    }
    const handleUpdateNode = (id: any, val: any) => {
        dispatch(updateProject({ id, node: { name: val } }));
        setTimeout(() => setNames((prev) => ({ ...prev, [id]: '' })), 300);
    }
    const handleSelectProject = (project: ProjectDetails, index: number) => {
        if (project?.tree) {
            if (activeProject?.id === project?.id) {
                dispatch(setActiveNode(null));
                dispatch(setActiveNodePath({}));
                dispatch(setKanbanViewType('single'));
                dispatch(selectProject(null));
            } else {
                dispatch(selectProject({ ...project, index }));
                dispatch(setKanbanViewType('list'));
                // dispatch(enableRepresentation('kanban'));
            }
        }
    }
    return (
        <>
            <DataTable
                id="project-data-table-10x"
                data={projects}
                caption={organisation?.corporateName ?? (organisation?.name || t('my-projects'))}
                meta={{
                    name: {
                        displayName: t('project-name'),
                        render: (p, index) => (
                            <div style={{
                                padding: 0,
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                minWidth: 200,
                                borderTopLeftRadius: index === 0 ? 5 : 0,
                            }}>
                                <EditableCell
                                    style={{ textAlign: 'left', borderTopLeftRadius: index === 0 ? 5 : 0 }}
                                    onEnter={(val) => handleUpdateNode(p.id, val)}
                                    onChange={(e: any) => setNames((prev) => ({ ...prev, [p.id]: e?.target?.value }))}
                                    value={names[p.id] || (p.tree?.name ?? p.name)}
                                    readonly={!p?.tree}
                                />
                                <EyeOpenIcon disabled={!p?.tree} onClick={() => handleSelectProject(p, index)} fill={ ( activeNode && (activeNode?.data?.attributes?.id === p?.tree?.attributes?.id) || activeProject?.id === p?.id) ? '#000' : '#ddd' } />
                            </div>
                        )
                    },
                    creator: {
                    displayName: t('project-manager'),
                    render: (p, index) => (
                        <div  style={{
                                padding: '0 5px',
                                background: '#fff',
                            }}
                            title={`${p.creator?.firstName ?? ''} ${p.creator?.lastName ?? ''}`}
                        >
                            <EditableCell
                                readonly
                                style={{ textAlign: 'right' }}
                                onEnter={(val) => console.log(val)}
                                defaultValue={`${p.creator?.firstName ?? ''} ${p.creator?.lastName ?? ''}`}
                            />
                        </div>
                    )
                    },
                    progression: {
                        displayName: t('progression'),
                        render: (p, index, extra) => {
                            const progress = getNodeCompletionRate(p?.tree as any);
                            return (
                                <div style={{
                                    display: 'flex',
                                    background: '#fff',
                                    borderBottom: '2px solid #fff',
                                    cursor: 'move'
                                }}>
                                    <Progress color="#ED6E40" progress={Math.round(progress * 100)} />
                                </div>
                            )
                        }
                    },
                    status: {
                        displayName: t('status'),
                        render: (p: any) => {
                            const st = getStatus((p?.tree ? p?.tree?.attributes?.status : p?.attributes?.status ));
                            return (
                                <DropdownSelectCell
                                    options={
                                        ['todo', 'started', 'completed'].map(k => ({ id: k, label: k, iconName: k }))
                                    }
                                    selected={st.status}
                                    onChange={(status) => {
                                        handleUpdateCell({ id: p.id, node: { id: p?.tree?.attributes?.id, status }});
                                        dispatch(setScrollId(p?.tree?.attributes?.id));
                                        dispatch(enableRepresentation('kanban'));
                                    }}
                                    color={st.color}
                                    disabled={!p?.tree}
                                />
                            )
                        }
                    },
                }}
                treeMeta={{
                    status: {
                        render: (pr, p) => {
                            const st = getStatus((p?.tree ? p?.tree?.attributes?.status : p?.attributes?.status));
                            return (
                                <DropdownSelectCell
                                    options={statusOptions}
                                    selected={st.status}
                                    onChange={(status) => handleUpdateCell({ id: pr.id, node: { id: p?.attributes?.id, status }})}
                                    color={st.color}
                                />
                            )
                        }
                    },
                    none: {
                        render: (p, node) => <CirclePlusIcon style={{ height: 20, width: 20 }} onClick={() => handleAddNewNode({ id: p.id, node })} />
                    }
                }}
                newColumn={{
                    renderData: (index) => {
                        return <div style={{
                                display: 'flex',
                                background: '#fff',
                        }}>
                            <EditableCell readonly />
                        </div>
                    },
                    renderHeader: () => newColumnClick ? (
                        <EditableCell
                            autoFocus
                            style={{ textAlign: 'right' }}
                            onBlur={handleBlurNewColumn}
                            onEnter={handleAddNewColumn}
                            defaultValue={newColumnName}
                        />
                    ) : <CirclePlusIcon style={{ height: 20, width: 20 }} onClick={() => setNewColumnClick(true)} />
                }}
                newRow={{
                    render: (d, index, len) => {
                        return (
                            <div style={{
                                display: 'flex',
                                background: '#fff',
                                borderBottomLeftRadius: index === 0 ? 5 : 0,
                                borderBottomRightRadius: index === len - 1 ? 5 : 0,
                        }}>
                            { index === 0 ? (
                                <span style={{ padding: '0 10px' }} title={t('use-map-to-select-location')}>
                                    <CirclePlusIcon style={{ height: 20, width: 20, marginTop: -5 }} onClick={handleNewRowClick} />
                                </span>
                            ) :  <span style={{ visibility: 'hidden' }}>h</span> }
                        </div>
                        )
                    }
                }}
                appendColums={newColumns}
            />
            <InputButton
                icon={<CirclePlusIcon background="none" />}
                text={t('add-section')}
                color="#fff"
                background="#F3BE3D"
                onEnter={(val) => console.log({ val })}
                style={{ marginTop: 25 }}
            />
        </>
    );
};

export default ProjectDataTable;
