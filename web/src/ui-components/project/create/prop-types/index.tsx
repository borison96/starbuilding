import { ProjectDetails } from "../../../../typings/api";

export type ProjectRoleType = { id: number | string; name: string; description: string; };
export type ProjectDataType = {
    name: string;
    description: string;
    contractor?: string;
    contractorEmail?: string;
    workType?: string;
    marketType?: string;
    team?: string;
    teamRoleId?: string;
    status?: string;
}
export type ScreenPropType = {
    onNext: (data: any) => void;
    onSave?: (data: any) => void;
    entrance?: boolean;
    exit?: boolean;
    roles?: Array<ProjectRoleType>;
    projectData?: ProjectDataType;
    project?: ProjectDetails;
    onComplete?: () => void;
}
