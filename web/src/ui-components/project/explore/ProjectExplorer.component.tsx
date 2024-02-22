import { MouseEvent } from 'react';
import { useDispatch, useSelector } from '../../../hooks';
import { selectProject, setActiveNode, setActiveNodePath } from '../../../services/redux/reducers/tree-node/treeNode.slice';
import { TreeNodeType } from '../../../typings';
import { ProjectDetails } from '../../../typings/api';
import { selectTreeNode, sortTreeNodes } from '../../../utils';
import './explorer.scss';

const ProjectExplorer = () => {
    const projects = useSelector(state => state.projects.payload);
    const activeProject = useSelector(state => state.treeNode.project);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const activeNodes = useSelector(state => state.treeNode.activeNodePath);
    const dispatch = useDispatch();
    const explore = Object.values<TreeNodeType>({ ...(activeNodes ?? {}), ...( activeNode ? { [activeNode?.data?.attributes?.id as string]: activeNode } : {}) })
                            .sort(sortTreeNodes);
    const handleClick = (e: MouseEvent , selectedNode: TreeNodeType) => {
        e.stopPropagation();
        dispatch(setActiveNode(selectedNode));
    };
    const isActive = (id: any) => id === activeNode?.data?.attributes?.id || (activeNodes && typeof activeNodes[id] !== 'undefined');
    const explorable = explore.length > 0 && explore[0];
    const filterProjects = projects?.length > 0 ? projects.filter((proj: any) => !proj?.parentId) : []; // dont should sub projects
    const explorePlaceholder = explorable ? "Explorer" : "Mes projets";
    const handleBack = (e: any) => {
        if(e?.key?.toLowerCase() === "backspace") {
            dispatch(setActiveNode(activeNode?.parent));
            selectTreeNode(activeNode?.parent?.data?.attributes?.id?.toString());
        }
    }
    const handleClose = (e?: MouseEvent) => {
        e?.stopPropagation();
        dispatch(setActiveNode(null));
        dispatch(setActiveNodePath({}));
        dispatch(selectProject(null));
    }
    const handleClickBack = (clickNode: TreeNodeType) => {
        dispatch(setActiveNode(clickNode));
        selectTreeNode(clickNode?.data?.attributes?.id?.toString());
    }
    const handleSelectProject = (project: ProjectDetails, index: number) => {
        if (project.id === -1) {
            handleClose();
        } else {
            dispatch(selectProject({ ...project, index }));
            if (project?.tree) {
                selectTreeNode(project?.tree?.attributes?.id);
            }
        }
    }
    return (
        <div tabIndex={0} role="button" onKeyDown={handleBack} className='explorer-0o87uu no-padding'>
            {  explorable ?
                explore.map((node: TreeNodeType, index) => {
                    const children = node?.children?.filter(cNode => cNode?.data?.attributes?.nodeType !== "empty");
                    return (
                        <div
                            tabIndex={0}
                            role="button"
                            className='explore-bread-crumbs-0r'
                            key={node?.data?.attributes?.id?.toString()}
                        >
                            <span className='separator-arrow-p'>{index > 0 ? '>' : ''}</span>
                            <div tabIndex={0} role='button' className='explorer-crumb-0ijf4' onClick={() => handleClickBack(node)} >
                                {
                                    index === 0 ? (
                                        <button className='explore-close-icon' onClick={handleClose}>
                                            {'x'}
                                        </button>
                                    ) : null
                                }
                                {node?.data?.name}
                                {
                                    children && children?.length > 0 ? (
                                        <>
                                            {
                                              index === explore.length - 1 ?  (
                                                    <svg width="20px" height="20px" viewBox="0 0 20 20" focusable="false" fill="#000000">
                                                        <polygon points="5,8 10,13 15,8"></polygon>
                                                    </svg>
                                                ) : null
                                            }
                                            <div className='explorer-dropdown-m3uu'>
                                            {
                                                children.map(
                                                    (childNode: TreeNodeType) => (
                                                        <button
                                                            type='button'
                                                            title={childNode?.data?.attributes?.description?.toString()}
                                                            className={`explorer-dropdown-m3uu-it3m ${isActive(childNode?.data?.attributes?.id) ? 'active' : ''}`}
                                                            key={childNode?.data?.attributes?.id?.toString()}
                                                            onClick={(e) => handleClick(e, childNode)}
                                                        >
                                                            {childNode?.data?.name}
                                                        </button>
                                                    )
                                                )
                                            }
                                        </div>
                                        </>
                                    ) : null
                                }
                            </div>
                        </div>
                    )
                }) : (
                    <div className='explore-search-project-09'>
                        <div tabIndex={0} role="button" className='explore-search-button-div'>
                            {explorePlaceholder}
                            {
                                filterProjects.length > 0 ? (
                                    <div className='explorer-proj-dropdown-m3uu'>
                                        {
                                            [...filterProjects, {
                                                id: -1,
                                                name: "Nouveau projet",
                                                description: "Nouveau projet"
                                            }].map(
                                                (project: ProjectDetails, index) => (
                                                    <button
                                                        type='button'
                                                        title={project.description}
                                                        className={`explorer-proj-dropdown-m3uu-it3m ${project.id?.toString() === activeProject?.id?.toString() ? 'active' : ''}`}
                                                        key={project.id}
                                                        onClick={() => handleSelectProject(project, index)}
                                                    >
                                                        {project.name}
                                                    </button>
                                                )
                                            )
                                        }
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default ProjectExplorer;
