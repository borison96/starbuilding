import { RawNodeDatum } from "react-d3-tree/lib/types/common";
import { KnowledgeNodeDatum } from ".";

export interface AuthSigninRequest {
    email: string;
    password: string;
}

export interface AuthSigninResponse {
    jwt: string;
    user: User;
}

export interface BasicApiResponse<T> {
    code: string;
    content: T;
    errors: BasicApiError[];
    warnings: BasicApiWarning[];
}

export interface BasicApiWarning {
    code: string;
    field: string;
    message: string;
}

export interface StackTraceElement extends Serializable {
    classLoaderName: string;
    className: string;
    fileName: string;
    lineNumber: number;
    methodName: string;
    moduleName: string;
    moduleVersion: string;
    nativeMethod: boolean;
}
export interface Serializable {}

export interface BasicApiError {
    code: string;
    message: string;
    detail: string;
}

export interface CreateUserForm {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    checkPassword?: string;
    phoneFixed?: number;
    linkedinUrl?: string;
    userType: string;
}

export interface User extends BaseEntityWithAudit {
    firstName: string;
    lastName: string;
    email: string;
    phone: number;
    phoneFixed: number;
    linkedinUrl: string;
}

export interface ProjectDetails {
    id?: number;
    description?: string;
    latitude?: number;
    longitude?: number;
    name?: string;
    status?: string;
    tree?: KnowledgeNodeDatum;
    creator?: User;
    parentId?: number;
    code?: string;
    picture?: string;
}

export interface BaseEntityWithAudit extends BaseEntity {
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthenticationResponse {
    access_token: string;
    user: User;
}

export interface AuthSigninForm {
    username: string;
    password: string;
}

export interface ResetPasswordForm {
    password: string;
    resetPasswordToken: string;
}

export interface BaseEntity {
    id: number;
    version: number;
}
export interface ProjectKnowledgeBase extends BaseEntity {
    projectId: number;
    tree: ProjectKnowledgeNode;
}

export interface ProjectKnowledgeBaseHelper {
}

export interface ProjectKnowledgeNode {
    name: string;
    attributes: ProjectKnowledgeNodeAttributes;
    children: ProjectKnowledgeNode[];
}

export interface ProjectKnowledgeNodeAttributes {
    id: string;
    description: string;
    nodeType: string;
    iconName: string;
    status: string;
    durationInSeconds: number;
    longitude: number;
    latitude: number;
    startsAt: number;
    data: string;
    assignees: string;
    watchers: string;
    reporter: string;
}