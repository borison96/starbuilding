import { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import screens from "./screens";
import './create-project.scss';
import { ProjectRoleType } from "./prop-types";
import ProjectService from "../../../api/service/project-service/project-service";
import { ProjectDetails } from "../../../typings/api";
import { enableActivity } from "../../../services/redux/reducers/map/map.slice";
import { useDispatch, useSelector } from "../../../hooks";
import { resetColumn } from "../../../services/redux/reducers/kanban/kanban.slice";
import { enableRepresentation } from "../../../services/redux/reducers/representation/representation.slice";

export type CreateProjectProptype = {
    onDismiss: () => void;
    onSubmit?: (data: any) => void;
    project?: ProjectDetails;
}

function CreateProject({ onDismiss, onSubmit, project }: CreateProjectProptype) {
    const { column: status } = useSelector(state => state.kanbanMeta);
    const [screenIndex, setScreenIndex] = useState(0);
    const [exit, setExit] = useState(false);
    const [entrance, setEntrance] = useState(false);
    const [data, setData] = useState<any>({});
    const [roles, setRoles] = useState<Array<ProjectRoleType>>();
    const dispatch = useDispatch();

    useEffect(() => {
        ProjectService.getRoleList().then(list => setRoles(list));
    }, []);
    const Screen = useMemo(() => screens[screenIndex], [screenIndex]);
    const handleSaveProject = (projectData: any) => {
        if (onSubmit) onSubmit(projectData);
        dispatch(enableActivity('create_project')); // allow create project on map
        dispatch(resetColumn()); // reset kanban column
    }
    const handleChange = (state: any) => {
        setData((prevData: any) => {
            setScreenIndex((prevIndex) => {
                setEntrance(true);
                setTimeout(() => setEntrance(false), 300);
                if (prevIndex < screens.length - 1) {
                    return prevIndex + 1;
                } else {
                    return prevIndex;
                }
            });
            return { ...prevData, ...state };
        });
        
    }
    const handleDismiss = () => {
        dispatch(enableActivity('create_project'));
        dispatch(enableRepresentation('kanban'));
        onDismiss();
    }
    const handleBack = () => {
        setScreenIndex((prevIndex) => {
            if (prevIndex > 0) {
                setExit(true);
                setTimeout(() => setExit(false), 300);
                return prevIndex - 1;
            }
            handleDismiss();
            return 0;
        });
    }
    return (
        <div style={{display: 'flex', minWidth: '80%'}}>
            <div style={{ flex: 2 }}>
                <Screen onSave={(state) => handleSaveProject({ ...data, ...state, status })} onComplete={handleDismiss} project={project} projectData={data} roles={roles} entrance={entrance} exit={exit} onNext={handleChange} />
            </div>
            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                <button className="proj-back__btn" onClick={handleBack}>Retour 
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137">
                        <path id="Flèche" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                    </svg>
                </button>
            </div>
        </div>
    );
}
export default CreateProject;
