import ErrorBoundary from "../../../errors/ErrorBoundary.component";
import { useDispatch } from "../../../hooks";
import { enableRepresentation,} from "../../../services/redux/reducers/representation/representation.slice";
import { RepresentationProps } from "../../../typings";
import GanttComponent from "../../../ui-components/gantt/Gantt.component"

const GanttView = ({ activeNode, projects, selectedProjectId, projectId, ...props }: RepresentationProps) => {
    const isProjectsView = !activeNode;
    const dispatch = useDispatch();
    const handleChangeRepresentation = (rep: 'map' | 'gantt' | 'kanban') => {
        dispatch(enableRepresentation(rep));
    }
    return (
        <ErrorBoundary>
            <div>
                <GanttComponent
                    isProjectsView={isProjectsView}
                    node={activeNode}
                    selectedProjectId={selectedProjectId}
                    {...props}
                    projects={projects}
                    onChangeRepresentation={handleChangeRepresentation}
                />
            </div>
        </ErrorBoundary>
    );
}
export default GanttView;
