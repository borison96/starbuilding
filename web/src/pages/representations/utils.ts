import { useDispatch } from "../../hooks";
import { enableActivity } from "../../services/redux/reducers/map/map.slice";
import { addNodeToTree, updateTreeNode } from "../../services/redux/reducers/project/knowledge-tree.slice";
import { updateProject } from "../../services/redux/reducers/project/projects.slice";
import { enableRepresentation, Representations } from "../../services/redux/reducers/representation/representation.slice";
import { disableNodeActivity } from "../../services/redux/reducers/tree-node/treeNode.slice";
import { ProjectDetails } from "../../typings/api";

export const onRepresentationChange = (selection: keyof typeof Representations, dispatch: ReturnType<typeof useDispatch>) => {
    dispatch(enableRepresentation(selection));
}
export const onAddNewNode = ({ id, node}: {id: any; node: any;}, dispatch: ReturnType<typeof useDispatch>) => {
    dispatch(addNodeToTree({id, node: {
        description: node?.attributes?.description,
        name: node?.name,
        nodeType: node?.attributes?.nodeType ?? 'libre',
        parentNodeId: node?.parentNodeId,
        data: node?.data,
        status: node?.attributes?.status ?? 'todo',
    }
    }));
}
export const onUpdateNode = ({ id, node }: { id: string | number; node: any;}, dispatch: ReturnType<typeof useDispatch>) => {
    dispatch(disableNodeActivity('auto_select_node_by_type'));
    dispatch(updateTreeNode({ id, node }));
}
export const onUpdateProject = ({ id, node}: { id: string | number; node: ProjectDetails}, dispatch: ReturnType<typeof useDispatch>) => {
    dispatch(updateProject({ id, node }));
}
export const onNewRowClick = (setter: (prop: boolean) => void, dispatch: ReturnType<typeof useDispatch>) => {
    setter(true);
    dispatch(enableActivity('create_project'));
    dispatch(enableRepresentation('map'));
}
