import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, connectDOMObserver, useSelector } from '../../hooks';
import CardHeader from '../../ui-components/card-header/card-header';
import DropdownComponent from '../../ui-components/commons/dropdown/DropDown.component';
import Overlay from '../../ui-components/overlay/Overlay.component';
import NodeDataTable from '../representations/node-datatable/NodeDataTable.component';
import ProjectDataTable from '../representations/node-datatable/ProjectDataTable.component';
import representations from '../representations';
import MapLayers from '../representations/map-component/map';
import { Representations } from '../../services/redux/reducers/representation/representation.slice';
import { ProjectDetails } from '../../typings/api';
import SplitPane from 'react-split-pane';
import { clearResizerTarget, setResizerTarget, updateResizerRightRow } from '../../services/redux/reducers/resizer/resizer.slice';
import { onAddNewNode, onNewRowClick, onRepresentationChange, onUpdateNode, onUpdateProject } from '../representations/utils';
import { setFullScreen } from '../../services/redux/reducers/fullscreen/fullscreen.slice';
import FullScreenIcon from '../../ui-components/icons/FullScreen.icon';
const RightColumn = () => {
    const { t } = useTranslation();
    const { component: representation } = useSelector(state => state.representation);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const activeProject = useSelector(state => state.treeNode.project);
    const projects = useSelector(state => state.projects.payload);
    const mapMeta = useSelector(state => state.mapMeta);
    const user = useSelector(state => state.user);
    const fullScreen = useSelector(state => state.fullScreen);

    const [maxPaneSize, setMaxPaneSize] = useState(400);

    const ref = useRef<HTMLDivElement>();
    const dispatch = useDispatch();
    const handleSetMaxPaneSize = () => {
        if (ref.current) {
            setMaxPaneSize(ref.current.clientHeight * 3/4);
        }
    }
    useEffect(() => {
        setResizerTarget('map');
        const disconnect = connectDOMObserver('.Pane1', 'attributes', (arg) => {
            const { clientHeight, clientWidth, clientLeft, clientTop } = arg.target as HTMLElement;
            dispatch(updateResizerRightRow({ height: clientHeight, width: clientWidth, x: clientLeft, y: clientTop }));
        });
        handleSetMaxPaneSize();
        window.addEventListener('resize', handleSetMaxPaneSize);
        return () => {
            clearResizerTarget();
            disconnect();
            window.removeEventListener('resize', handleSetMaxPaneSize);
        };
    }, []);

    const [newRowClick, setNewRowClick] = useState(false);
    const handleCreateDismiss = () => {
        setNewRowClick(false);
    }
    const handleNewRowClick = () => {
        onNewRowClick(setNewRowClick, dispatch);
    }
    const handleRepresentationChange = (selection: keyof typeof Representations) => {
        onRepresentationChange(selection, dispatch);
    }
    const handleAddNewNode = (val: {id: any; node: any;}) => {
        onAddNewNode(val, dispatch);
    }
    const handleUpdateNode = (val: { id: string | number; node: any;}) => {
        onUpdateNode(val, dispatch);
    }
    const handleUpdateProject = (val: { id: string | number; node: ProjectDetails}) => {
        onUpdateProject(val, dispatch);
    }
    const RepresentationComponent = useMemo(
        () => representations[representation as keyof typeof representations] ?? MapLayers,
        [representation]);
    return (
        <div style={{ position: 'relative' }} className={"project"}>
            <CardHeader title={`Contextualiser (${activeNode?.data?.name ? activeNode?.data?.name : "Mes projets"})`}
                        search={
                            <DropdownComponent
                                options={
                                    Object.entries(Representations).filter(([, v]) => v)
                                        .map(([k]) => ({ id: k, label: k }))}
                                onChange={(val: any) => handleRepresentationChange(val)}
                                selected={representation}
                                activeNode={activeNode?.data}
                            />
                        }/>
            <div ref={ref} style={{ position: 'relative', height: '100%' }}>
                <SplitPane
                    split="horizontal"
                    defaultSize={maxPaneSize < 350 ? maxPaneSize : 350}
                    maxSize={maxPaneSize}
                    resizerClassName="resizer-handle"
                >
                    <div className="presentation-container" id="representation-container-10x">
                        <RepresentationComponent
                            activeNode={activeNode?.data}
                            projectId={activeProject?.id}
                            nodeName={activeProject?.name}
                            nodeId={activeNode?.data?.attributes?.id?.toString()}
                            pins={projects}
                            projects={projects}
                            onUpdateNode={handleUpdateProject}
                            onUpdateCell={handleUpdateNode}
                            onAddNewNode={handleAddNewNode}
                            selectedProjectId={activeProject?.id}
                            activeProject={activeProject}
                            user={user}
                        />
                    </div>
                    <div style={{ height: '100%', overflow: 'auto' }}>
                        <div className="resizer-handle-bar top">
                            <div className="resizer-handle-bar-line">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                            {
                                fullScreen.target !== 'data-table' ? (
                                    <button onClick={() => dispatch(setFullScreen({ target: 'data-table' }))} className="full-screen-handle">
                                        {t('fullscreen')}
                                        <FullScreenIcon />
                                    </button>
                                ) : null
                            }
                        </div>
                        {
                            fullScreen.target !== 'data-table' ? (
                                activeNode ? (
                                    <NodeDataTable />
                                ) : (
                                    <ProjectDataTable onNewRowClick={handleNewRowClick} />
                                )
                            ) : null
                        }
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
                    </div>
                </SplitPane>
            </div>
        </div>
    );
};

export default RightColumn;
