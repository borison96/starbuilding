import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../hooks';
import { loadProjectNodeStatuses } from '../../services/redux/reducers/project/project-node-statuses.slice';
import { loadProjectNodeTypes } from '../../services/redux/reducers/project/project-node-types.slice';
import { getProjects } from '../../services/redux/reducers/project/projects.slice';
import { getCurrentUserInfo } from '../../services/redux/reducers/user/user-reducer';
import CardHeader from '../../ui-components/card-header/card-header';
import FavBlock from '../../ui-components/favorite-block/FavBlock.component';
import ProjectExplorer from '../../ui-components/project/explore/ProjectExplorer.component';
import { FullScreenLayer } from '../layers/Fullscreen.layer';
import D3Project from '../representations/tree-component/d3-project';
import './dashboard.scss';
import InvitationContainer from './invitation-panel';
import RightColumn from './RightColum.component';

const Dashboard = () => {
    const projectNodeTypes = useSelector(state => state.projectNodeTypes);
    const activeProject = useSelector(state => state.treeNode.project);
    const tab = useSelector((state) => state.pages.selected_tab);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getCurrentUserInfo());
        dispatch(getProjects());
        dispatch(loadProjectNodeTypes(0));
        dispatch(loadProjectNodeStatuses(0));
    }, []);
    
    console.count('dashboard');
    return (
        <>
        {tab === "Invitation" && (
                <InvitationContainer project={activeProject?.id}/>
            )}
        <div className="dashboard-layout">
            <div className='explorer'>
                    <CardHeader title={"Explorer"} search={
                        <ProjectExplorer />
                    }/>
                    <FavBlock favs={projectNodeTypes.payload ?? []}/>
                <div className={"canvas-explorer"}>
                    <D3Project />
                </div>
            </div>
            <RightColumn />
            <FullScreenLayer />
        </div>
    </>
    );
}
export default Dashboard;
