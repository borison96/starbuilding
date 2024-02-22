import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "../../../hooks";
import { addChildrenToNodeSection, addNodeSection, addNodeToTree, moveChildrenBetweenNodeSections, removeChildrenFromNodeSection, updateTreeNode } from "../../../services/redux/reducers/project/knowledge-tree.slice";
import { KnowledgeNodeDatum, ProjectKnowledgeSection } from "../../../typings";
import { EditableCell } from "../../../ui-components/commons/table";
import { DropRawTarget } from "../../../ui-components/commons/table/DropRowTarget.component";
import { InputButton } from "../../../ui-components/controls/button/InputButton.component";
import TreeDataTable from "../../../ui-components/datatables/TreeDataTable.component";
import { DragKnowledgeNodeItemType } from "../../../ui-components/drag-n-drop";
import CirclePlusIcon from "../../../ui-components/icons/CirclePlus.icon";
import { newTreeNode, sortDataTableProjects } from "../../../utils";
import './node-datatable.scss';

const NodeDataTable = () => {
    const node = useSelector(state => state.treeNode.activeNode);
    const activeProject = useSelector(state => state.treeNode.project);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [newColumnClick, setNewColumnClick] = useState(false);
    const [nodeNames, setNodeNames] = useState<{[key: string]: any}>({});
    const [nodeData, setNodeData] = useState<{[key: string]: any}>({});
    const [ungroupedChildNodes, setUngroupedChildNodes] = useState<Array<KnowledgeNodeDatum>>([]);
    const [nodeGroups, setNodeGroups] = useState<Record<string, ProjectKnowledgeSection>>({});
    const [childNodes, setChildNodes] = useState<Array<any>>([]);
    const [newColumns, setNewColumns] = useState<Array<string>>([]);
    const [newColumnName, setNewColumnName] = useState('');
    const handleBlurNewColumn = (name: string) => {
        setNewColumnName(name);
        setNewColumnClick(false);
    }
    const handleNewRowClick = (e: any) => {
        setChildNodes((prev) => ([...prev, { ...newTreeNode, attributes: { ...newTreeNode.attributes, id: (new Date()).getTime() * Math.random(), nodeType: 'libre' }}]))
    }
    useEffect(() => {
        let nodes = [...(node?.data?.children ?? [])].sort(sortDataTableProjects);
        const sectionIds = node?.data?.attributes?.sections?.length > 0 ?
            node?.data?.attributes?.sections?.reduce((acc, sec) => [...acc, ...(sec?.children ?? [])] , []):
            [];
        setUngroupedChildNodes(nodes?.filter(n => {
            if (sectionIds?.length > 0) {
                return !sectionIds?.includes(n.attributes?.id);
            }
            return true;
        }));
        const groups: Record<string, ProjectKnowledgeSection> = {};
        node.data?.attributes?.sections?.forEach(sec => {
            groups[sec.id] = {...sec, childNodes: sec.children?.map(sChild => nodes.find(n => n.attributes?.id == sChild)) };
        });
        setNodeGroups(groups);
    }, [node]);
    const handleUpdateNode = ({ id, node }: { id: string | number; node: any;}) => {
        dispatch(updateTreeNode({ id, node }));
    }
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
    const handleAddNewColumn = (name: string) => {
        if (name?.trim()) {
            setNewColumns([ ...newColumns, name ]);
            setNewColumnName('');
        }
        setNewColumnClick(false);
    }
    const handleAddSection = (name: string) => {
        if (name?.trim()) {
            dispatch(addNodeSection({
                projectId: activeProject?.id, nodeId: node?.data?.attributes?.id?.toString(), section: { name },
            }));
        }
    }
    const handleDropItemOnEmpty = (item?: DragKnowledgeNodeItemType, target?: number | string) => {
        if (item && target) {
            dispatch(addChildrenToNodeSection({ projectId: activeProject?.id, nodeId: node?.data?.attributes?.id, sectionId: target, chldren: [ item.id ]}));
        }
    }
    const handleDropItem = (item?: DragKnowledgeNodeItemType, target?: number | string) => {
        console.log({ item, target });
        if (item) {
            if (target && item.groupId) {
                // moving
                dispatch(moveChildrenBetweenNodeSections({
                    projectId: activeProject?.id,
                    nodeId: node?.data?.attributes?.id,
                    sourceId: item.groupId,
                    targetId: target,
                    chldren: [ item.id ],
                }));
            } else if (target) {
                // adding
                dispatch(addChildrenToNodeSection({ projectId: activeProject?.id, nodeId: node?.data?.attributes?.id, sectionId: target, chldren: [ item.id ]}));
            } else if (item.groupId) {
                // removing
                dispatch(removeChildrenFromNodeSection({ projectId: activeProject?.id, nodeId: node?.data?.attributes?.id, sectionId: item.groupId, chldren: [ item.id ]}));
            }
        }
    }
    const ComponentTable = ({ nodes, caption, groupId }:{
        nodes: Partial<KnowledgeNodeDatum>[];
        caption: string;
        groupId?: string;
    }) => {
        return (
            <TreeDataTable
                id="node-data-table-10x"
                caption={caption}
                groupId={groupId}
                data={nodes}
                meta={{
                    elements: {
                        displayName: t('elements'),
                        render: (p: any, index) => {
                            return (
                                <div style={{
                                    display: 'flex',
                                    background: '#fff',
                                    borderTopLeftRadius: index === 0 ? 5 : 0,
                                    borderTopRightRadius: index === 0 ? 5 : 0,
                            }}>
                                <EditableCell
                                    style={{ textAlign: 'right' }}
                                    onEnter={(val) => handleUpdateNode({ id: activeProject?.id, node: { id: p?.attributes?.id, name: val }})}
                                    //onChange={(e: any) => setNodeNames((prev) => ({ ...prev, [p?.attributes?.id]: e?.target?.value }))}
                                    //value={nodeNames[p?.attributes?.id] ?? p.name}
                                    defaultValue={p.name ?? ''}
                                    title={p?.attributes?.data}
                                />
                            </div>
                            )
                        }
                    },
                }}
                treeMeta={{
                    data: {
                        render: (pr, p, index) => {
                            return (
                                <div style={{
                                    display: 'flex',
                                    background: '#fff',
                                    borderTopLeftRadius: index === 0 ? 5 : 0,
                                    borderTopRightRadius: index === 0 ? 5 : 0,
                            }}>
                                <EditableCell
                                    style={{ textAlign: 'right' }}
                                    onEnter={(val) => handleUpdateNode({ id: activeProject?.id, node: { id: p?.attributes?.id, data: val }})}
                                    //onChange={(e: any) => setNodeData((prev) => ({ ...prev, [p?.attributes?.id]: e?.target?.value }))}
                                    //value={nodeData[p?.attributes?.id] ?? (p?.attributes?.data || '')}
                                    defaultValue={p?.attributes?.data || ''}
                                />
                            </div>   
                            )
                        }
                    },
                    empty: {
                        render: (p, vNode) => <CirclePlusIcon style={{ height: 20, width: 20 }} onClick={() => handleAddNewNode({ id: activeProject?.id, node: { ...vNode, parentNodeId: p?.attributes?.id } })} />
                    },
                    none: {
                        render: (p, vNode, index) => {
                            return (
                                <div style={{
                                    display: 'flex',
                                    background: '#eee',
                                    borderTopLeftRadius: index === 0 ? 5 : 0,
                                    borderTopRightRadius: index === 0 ? 5 : 0,
                            }}>
                                <EditableCell
                                    onEnter={(val) => handleAddNewNode({ id: activeProject?.id, node: { ...vNode, data: val, parentNodeId: p?.attributes?.id } })}
                                />
                            </div>
                            )
                        }
                    },
                }}
                newColumn={{
                    renderData: (index) => {
                        return <div style={{
                                display: 'flex',
                                background: '#fff',
                                borderTopLeftRadius: index === 0 ? 5 : 0,
                                borderTopRightRadius: index === 0 ? 5 : 0,
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
                handleDropItem={handleDropItem}
            />
        );
    }
    return (
        <>
         {
            ungroupedChildNodes?.length > 0 ? (
                <ComponentTable key={node.data.name} caption={node.data?.name} nodes={ungroupedChildNodes} />
            ) : null
         }
         {
            node.data?.attributes?.sections.length > 0 ? (
                Object.values(nodeGroups).map(
                    nGroup => {
                        return (
                            <div key={nGroup.id}>
                                <ComponentTable
                                    caption={`${nGroup.name} (${nGroup?.childNodes?.length ?? 0})`}
                                    nodes={nGroup.childNodes}
                                    groupId={nGroup.id}
                                />
                                {
                                    !nGroup.childNodes || nGroup.childNodes?.length === 0 ? (
                                        <DropRawTarget target={nGroup.id} onDrop={handleDropItemOnEmpty}>
                                            <div className={`empty-node-group-section `}>
                                                {t('empty-section')}
                                            </div>
                                        </DropRawTarget>
                                    ) : null
                                }
                            </div>
                        )
                    }
                )
            ) : null
         }
          <InputButton
            icon={<CirclePlusIcon background="none" />}
            text={t('add-section')}
            color="#fff"
            background="#F3BE3D"
            onEnter={(val) => handleAddSection(val)}
            style={{ marginTop: 25 }}
          />
        </>
    );
};

export default NodeDataTable;
