import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Rnd } from "react-rnd";
import { useDispatch, useSelector } from "../../hooks"
import { clearFullScreen } from "../../services/redux/reducers/fullscreen/fullscreen.slice";
import NodeDataTable from "../representations/node-datatable/NodeDataTable.component";
import ProjectDataTable from "../representations/node-datatable/ProjectDataTable.component";

export const FullScreenLayer = () => {
    const fullScreen = useSelector(state => state.fullScreen);
    const activeNode = useSelector(state => state.treeNode.activeNode);
    const dispatch = useDispatch();
    const Screen = useMemo(() => {
        switch(fullScreen.target) {
            case 'data-table':
                return activeNode ? (
                    <NodeDataTable />
                ) : (
                    <ProjectDataTable />
                );
            default:
                return null
        }
    }, [fullScreen.target, activeNode]);
    return Screen ? (
        <div
            style={{
                background: 'rgba(250,250,250, 0.9)',
                padding: 15, overflow: 'auto',
                zIndex: 10,
                minWidth: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                height: '100%',
                width: '100%',
            }}
        >
            <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                <button onClick={() => dispatch(clearFullScreen())} className="full-screen-dismiss">
                    <FontAwesomeIcon icon={faTimes} />
                </button>
            </div>
            { Screen }
        </div>
    ) : null;
}
