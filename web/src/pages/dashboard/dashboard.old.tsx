import React, {useEffect, useMemo, useState} from 'react';
import {getCurrentUserInfo} from "../../services/redux/reducers/user/user-reducer";
import {useDispatch, useSelector} from '../../hooks';
import './dashboard.scss'
import MapLayers from "../representations/map-component/map";
import D3Project from "../representations/tree-component/d3-project";
import CardHeader from "../../ui-components/card-header/card-header";
import { getProjects, updateProject } from '../../services/redux/reducers/project/projects.slice';
import { ProjectDetails } from '../../typings/api';
import { ActiveNodesType, MapCoordsType, NodeTableData, TreeNodeType } from '../../typings';
import ProjectExplorer from '../../ui-components/project/explore/ProjectExplorer.component';
import { addNodeToTree, loadKnowledgeTree, updateTreeNode } from '../../services/redux/reducers/project/knowledge-tree.slice';
import { loadProjectNodeTypes } from '../../services/redux/reducers/project/project-node-types.slice';
import { newTreeNode} from '../../utils';
import FavBlock from '../../ui-components/favorite-block/FavBlock.component';
import InvitationContainer from "./invitation-panel";
import {MapViewChange, ProjectViewChange} from "../../services/redux/reducers/auth/auth.slice";
import { useTranslation } from 'react-i18next';
import { loadProjectNodeStatuses } from '../../services/redux/reducers/project/project-node-statuses.slice';
import Overlay from '../../ui-components/overlay/Overlay.component';
import { enableActivity } from '../../services/redux/reducers/map/map.slice';
import {checkNodeData, getNodeData} from "../../services/redux/reducers/forge/forge.slice";
import { enableRepresentation, Representations } from '../../services/redux/reducers/representation/representation.slice';
import DropdownComponent from '../../ui-components/commons/dropdown/DropDown.component';
import representations from '../representations';
import ProjectDataTable from '../representations/node-datatable/ProjectDataTable.component';
import NodeDataTable from '../representations/node-datatable/NodeDataTable.component';

const Dashboard = () => {
    const dispatch = useDispatch();
    const storeProjects = useSelector(state => state.projects);
    const knowledgeTree = useSelector(state => state.knowledgeTree);
    const projectNodeTypes = useSelector(state => state.projectNodeTypes);
    const projectNodeStatuses = useSelector(state => state.projectNodeStatuses);
    const user = useSelector(state => state.user);
    const mapMeta = useSelector(state => state.mapMeta);
    const { component: representation } = useSelector(state => state.representation);
    const nodeData = useSelector(state => state.nodeData);
    const tab = useSelector<string>((state) => state.pages.selected_tab);
    const map_active = useSelector<boolean>((state) => state.pages.map_view);
    const [activeNodes, setActiveNodes] = useState<any>({});
    const [activeNodeId, setActiveNodeId] = useState<any>('');
    const [urn, setUrn] = useState(false);
    const [active, setActive] = useState<TreeNodeType | null>();
    const [activeProxy, setActiveProxy] = useState<TreeNodeType | null>();
    const [treeData, setTreeData] = useState<any>(newTreeNode);
    const [projects, setProjects] = useState<Array<NodeTableData | ProjectDetails>>();
    const [exploreProjectId, setExploreProjectId] = useState<any>();
    const [mapCoords, setMapCoords] = useState<MapCoordsType>();
    const [newColumnName, setNewColumnName] = useState('');
    const [newRowClick, setNewRowClick] = useState(false);
    const [newColumns, setNewColumns] = useState<Array<string>>([]);

    const { t } = useTranslation();

    const setProjectView = (value:boolean) => {
        if (knowledgeTree.payload)
            dispatch(ProjectViewChange({is_active: value, name: knowledgeTree.payload.name}))
    }

    useEffect(() => {
        dispatch(getCurrentUserInfo());
        dispatch(getProjects());
        dispatch(loadProjectNodeTypes(exploreProjectId));
        dispatch(loadProjectNodeStatuses(exploreProjectId));
    }, []);

    useEffect(() => {
        if (!storeProjects.isLoading && storeProjects.payload) {
            setProjects(storeProjects.payload);
        }
    }, [storeProjects]);

    useEffect(() => {
        if (exploreProjectId) {
            if (exploreProjectId !== "new-project")
                dispatch(loadKnowledgeTree(exploreProjectId));
            else setTreeData(newTreeNode);
        }
    }, [exploreProjectId]);
    const activeProject = useMemo(() => storeProjects?.payload?.find(f => f.id === exploreProjectId), [exploreProjectId]);

    useEffect(() => {
        if (!knowledgeTree.isLoading && knowledgeTree.payload) {
            setTreeData(knowledgeTree.payload);
            setProjects(storeProjects.payload);
        }
    }, [knowledgeTree])

    useEffect(() => {
        if (typeof active !== 'undefined' && active !== null) {
            dispatch(MapViewChange(true))
            let node = {...active};
            let parentIds: ActiveNodesType = {};
            while (node !== null && node !== undefined) {
                if (node?.data?.attributes?.id && node?.parent?.data?.attributes?.id) {
                    parentIds = {
                        ...parentIds,
                        [node?.parent?.data?.attributes?.id as string]: node.parent,
                        [node?.data?.attributes?.id as string]: node,
                    };
                }
                node = node?.parent as TreeNodeType;
            }
            setActiveNodes(parentIds);
            setProjectView(true);
        } else {
            setProjectView(false);
            setActiveNodeId('');
        }
        setActiveProxy(active);
    }, [active]);

    const clickOnNode = (node: TreeNodeType) => {
        setActiveNodeId(node?.data?.attributes.id.toString());
        if (node?.data?.attributes.nodeType === "ifc") {
            dispatch(checkNodeData(node.data.attributes.id.toString()))
            dispatch(getNodeData(node.data.attributes.id.toString()))
            dispatch(MapViewChange(false))
        }
        // can add any click on node type interaction here
        else if (node?.data?.attributes.nodeType !== "ifc") {
            dispatch(MapViewChange(true))
        }
    }
    const handleSetActiveNode = (node: TreeNodeType) => {
        setActive(node);
        clickOnNode(node);
        switch(node?.data?.attributes?.nodeType) {
            case 'ifc':
            case 'model_3d':
                dispatch(enableRepresentation('model_3d'));
                break;
            default:
                dispatch(enableRepresentation('kanban'));
                break;   
        }
    }

    useEffect(() => {
        console.log(map_active)
    }, [map_active]);

    useEffect(() => {
        if (nodeData.response.errors.length > 0) {
            setUrn(false);
        } else if (nodeData.response.content != null) {
            setUrn(true);
        }
    }, [nodeData]);




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
    }
    const handleUpdateNode = ({ id, node }: { id: string | number; node: any;}) => {
        if (!knowledgeTree.isLoading) {
            dispatch(updateTreeNode({ id, node }));
        }
    }
    const handleBlurNewColumn = (name: string) => {
        setNewColumnName(name);
    }
    const handleCreateDismiss = () => {
        setNewRowClick(false);
    }
    const handleNewRowClick = () => {
        setNewRowClick(true);
        dispatch(enableActivity('create_project'));
        dispatch(enableRepresentation('map'));
    }
    const handleUpdateProject = ({ id, node}: { id: string | number; node: ProjectDetails}) => {
        dispatch(updateProject({ id, node }));
    }
    const handleRepresentationChange = (selection: keyof typeof Representations) => {
        dispatch(enableRepresentation(selection))
    }
    const RepresentationComponent = useMemo(
        () => representations[representation as keyof typeof representations] ?? MapLayers,
        [representation]);
    console.count('dashboard');
    return (
        <>
            {tab === "Invitation" && (
                <InvitationContainer project={exploreProjectId}/>
            )}
            <div className={"dashboard-layout"}>
                <div className={"explorer"}>
                    <CardHeader title={"Explorer"} search={
                        <ProjectExplorer />
                    }/>
                    <FavBlock favs={projectNodeTypes.payload ?? []}/>
                    <div className={"canvas-explorer"}>
                        {/* <D3Project
                            active={active}
                            treeData={treeData}
                            activeNodes={activeNodes}
                            setActive={handleSetActiveNode}
                            setActiveNodes={setActiveNodes}
                            selectedProjectId={exploreProjectId}
                            mapCoords={mapCoords}
                            user={user}
                        /> */}
                    </div>
                </div>
                <div className={"project"}>
                    <CardHeader title={`Contextualiser (${active?.data?.name ? active?.data?.name : "Mes projets"})`}
                                search={
                                    <DropdownComponent
                                        options={
                                            Object.entries(Representations).filter(([, v]) => v)
                                                .map(([k]) => ({ id: k, label: k }))}
                                        onChange={(val: any) => handleRepresentationChange(val)}
                                        selected={representation}
                                        activeNode={activeProxy?.data}
                                    />
                                }/>
                    <div className={"presentation-container"} id="representation-container-10x">
                        <RepresentationComponent
                            activeNode={activeProxy?.data}
                            projectId={activeProject?.id}
                            nodeName={activeProject?.name}
                            has_urn={urn}
                            nodeId={activeNodeId}
                            onPin={setMapCoords}
                            pins={projects}
                            projects={projects}
                            onUpdateNode={handleUpdateProject}
                            onUpdateCell={handleUpdateNode}
                            onAddNewNode={handleAddNewNode}
                            onAddNewColumn={handleAddNewColumn}
                            selectedProjectId={exploreProjectId}
                            activeProject={activeProject}
                            user={user}
                        />
                    </div>
                    {
                        (
                            active?.data
                        ) ? (
                            // <NodeDataTable
                            //     selectedProjectId={exploreProjectId}
                            //     id="node-data-table-10x"
                            //     node={activeProxy?.data}
                            //     onUpdateNode={handleUpdateProject}
                            //     onUpdateCell={handleUpdateNode}
                            //     onAddNewNode={handleAddNewNode}
                            //     onNewColumnBlur={handleBlurNewColumn}
                            //     onAddNewColumn={handleAddNewColumn}
                            //     newColumnName={newColumnName}
                            //     newColumns={newColumns}
                            //     onNewRowClick={handleNewRowClick}
                            //     statusOptions={projectNodeStatuses.payload}
                            // />
                            <span />
                        ) : (
                            <>
                                {/* {
                                    projects?.length > 0 ? (
                                        <ProjectDataTable
                                            id="project-data-table-10x"
                                            data={storeProjects?.payload}
                                            onUpdateNode={handleUpdateProject}
                                            onUpdateCell={handleUpdateNode}
                                            onAddNewNode={handleAddNewNode}
                                            onNewColumnBlur={handleBlurNewColumn}
                                            onAddNewColumn={handleAddNewColumn}
                                            newColumnName={newColumnName}
                                            newColumns={newColumns}
                                            onNewRowClick={handleNewRowClick}
                                            statusOptions={projectNodeStatuses.payload}
                                            activeProject={activeProject}
                                            activeNode={activeProxy?.data}
                                            setSelectedProjectId={setExploreProjectId}
                                            selectedProjectId={exploreProjectId}
                                        />
                                    ) : null
                                } */}
                                {
                                    newRowClick ? (
                                        (
                                            <Overlay show={newRowClick} el="#project-data-table-10x" container="#project-data-table-10x" onDismiss={handleCreateDismiss}>
                                                <code>{mapMeta.selection.description}</code>
                                                <blockquote>{t('use-map-to-select-location')}</blockquote>
                                            </Overlay>
                                        )
                                    ) : null
                                }
                            </>
                        )
                    }
                </div>
            </div>
        </>
    )
}
export default Dashboard;
