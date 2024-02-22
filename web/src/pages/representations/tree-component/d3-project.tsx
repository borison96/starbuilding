import * as d3 from "d3";
import React, {CSSProperties, useEffect, useRef, useState} from 'react';
import Tree from "react-d3-tree";
import TreeNode from "./TreeNode.component";
import './tree-nodes.scss';
import {
    ActiveNodesType,
    EmptyNodePlacementType,
    KnowledgeNodeDatum,
    NewNodeDataType,
    TreeNodeType,
} from "../../../typings";
import TreeNodeForm from "./TreeNodeForm.component";
import {useDispatch, useSelector} from "../../../hooks";
import {addNodeToTree} from "../../../services/redux/reducers/project/knowledge-tree.slice";
import {createProject} from "../../../services/redux/reducers/project/project.slice";
import {addProject } from "../../../services/redux/reducers/project/projects.slice";
import { newTreeNode, selectTreeNode } from "../../../utils";
import { enableNodeActivity, setActiveNode, setActiveNodePath } from "../../../services/redux/reducers/tree-node/treeNode.slice";
import { enableRepresentation } from "../../../services/redux/reducers/representation/representation.slice";
import { ProjectViewChange } from "../../../services/redux/reducers/auth/auth.slice";
import { disableActivity, enableActivity } from "../../../services/redux/reducers/map/map.slice";

const D3Project = () => {
    const dispatch = useDispatch();
    const activeProject = useSelector(state => state.treeNode.project);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const activeNodes = useSelector(state => state.treeNode.activeNodePath);
    const mapSelection = useSelector(state => state.mapMeta.selection);
    const projects = useSelector(state => state.projects?.payload);
    const nodeActivities = useSelector(state => state.treeNode.activities);
    const user = useSelector(state => state.user);
    let treeContainer = useRef<HTMLDivElement>(null)
    const [translate, setTranslate] = useState({x: 0, y: 0});
    const [dimensions, setDimensions] = useState({width: 0, height: 0});
    const [emptyNodePlacement, setEmptyNodePlacement] = useState<EmptyNodePlacementType>();
    const [treeData, setTreeData] = useState<KnowledgeNodeDatum>(newTreeNode);
    useEffect(() => {
        if (activeProject?.tree) {
            const stateCopy = projects?.find(p => p.id === activeProject?.id)
            if (stateCopy) {
                setTreeData(stateCopy?.tree);
            }
        } else {
            setTreeData(newTreeNode);
        }
    }, [activeProject, projects]);
    useEffect(() => {
        if (treeData && activeNode) {
            selectTreeNode(activeNode?.data?.attributes?.id?.toString());
        }
    }, [treeData])
    useEffect(() => {
        const dimension = treeContainer?.current?.getBoundingClientRect();
        setTranslate({
            x: dimension ? dimension.width / 10 : 0,
            y: dimension ? dimension.width / 3 : 0
        });
        setDimensions({width: dimension?.width ?? 0, height: dimension?.height ?? 0});
        setEmptyNodePlacement({});
        let node = { ...activeNode };
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
        dispatch(setActiveNodePath(parentIds));
        if (!activeNode) {
            dispatch(ProjectViewChange({is_active: false, name: treeData?.name }));
        }
    }, [activeNode]);
    useEffect(() => {
        if (emptyNodePlacement?.showForm) {
            dispatch(disableActivity('create_project'));
        } else {
            dispatch(enableActivity('create_project'));
        }
    }, [emptyNodePlacement?.showForm]);
    const handleSetActiveNode = (node: TreeNodeType | null) => {
        dispatch(setActiveNode(node));
        setEmptyNodePlacement({});
        if (nodeActivities.auto_select_node_by_type) {
            switch(node?.data?.attributes?.nodeType) {
                case 'ifc':
                case 'model_3d':
                    dispatch(enableRepresentation('model_3d'));
                    break;
                case 'documents':
                    dispatch(enableRepresentation('files'));
                    break;  
            }
        } else {
            dispatch(enableNodeActivity('auto_select_node_by_type'));
        }
        dispatch(ProjectViewChange({is_active: true, name: treeData?.name }));
    };
    const handleNewNodeSubmit = (submitNode: NewNodeDataType) => {
        if (emptyNodePlacement?.node?.parent) {
            dispatch(addNodeToTree({id: activeProject?.id, node: submitNode}));
        } else {
            dispatch(createProject({
                description: submitNode.description ?? '',
                latitude: submitNode.latitude ?? 0,
                longitude: submitNode.longitude ?? 0,
                name: submitNode.name
            })).unwrap().then(
                (projectResponse) => {
                    dispatch(addProject({ ...(projectResponse?.project ?? {}), tree: projectResponse?.knowledgeBase?.tree, creator: user }));
                }
            );
        }
        setEmptyNodePlacement({});
    };
    const handleCloseEmplacement = () => setEmptyNodePlacement({});
    const renderNode = ({nodeDatum, toggleNode, ...props}: any) => (
        <TreeNode
            nodeDatum={nodeDatum}
            toggleNode={toggleNode}
            activeNodes={activeNodes}
            setActive={handleSetActiveNode}
            d3ExtraProps={props}
            active={activeNode?.data?.attributes?.id?.toString()}
            setEmptyNodePlacement={setEmptyNodePlacement}
        />
    );
    const pathClass = ({source, target}: any) => {
        if (target?.data?.attributes?.nodeType === "empty") {
            return activeNode?.data?.attributes?.id === source?.data?.attributes?.id ? "node-link to-empty" : "empty-link";
        }
        return (
            activeNodes && (
                activeNodes[target?.data?.attributes?.id]?.data?.attributes?.id === target?.data?.attributes?.id ||
                activeNode?.data?.attributes?.id === target?.data?.attributes?.id
            ) ? "node-link to-active" : "node-link"
        );
    };
    const containerStyles: CSSProperties = {
        height: "100%",
        width: "100%",
        overflow: "auto",
    };
    return (
        <div id="d3-tree-project" style={containerStyles} ref={treeContainer}>
            <Tree
                data={treeData as any}
                orientation={"horizontal"}
                translate={translate}
                renderCustomNodeElement={renderNode}
                pathClassFunc={pathClass}
                collapsible={true}
                depthFactor={0}
                dimensions={dimensions}
                separation={{
                    siblings: 0.5
                }}
            />
            {
                emptyNodePlacement?.showForm && (
                    <TreeNodeForm
                        mapCoords={mapSelection}
                        placement={emptyNodePlacement}
                        onSubmit={handleNewNodeSubmit}
                        onClose={handleCloseEmplacement}
                    />
                )
            }
        </div>
    );
};

export default D3Project;
