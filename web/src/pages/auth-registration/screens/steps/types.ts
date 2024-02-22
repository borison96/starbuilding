import { CreateOrganisation, Organisation } from "../../../../domain/domain";

export interface RegisterDataType {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    checkPassword?: string;
    phone?: string;
    phoneFixed?: string;
    portfolioUrl?: string;
    selectedOrg?: Organisation;
};
export interface StepsPropsType  {
    onNext?: (props: any) => void;
    data?: RegisterDataType;
    errors?: RegisterDataType;
    onChange?: (props: any) => void;
    onComplete?: (props: any) => void;
};

export interface CreateOrgPropsType {
    data?: CreateOrganisation;
    onNext?: (props: any) => void;
    errors?: CreateOrganisation;
    onChange?: (props: any) => void;
};
