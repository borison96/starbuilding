import { HierarchyPointNode } from "d3";
import { LazyExoticComponent, ReactElement, ReactNode } from "react";
import { RawNodeDatum, TreeNodeDatum } from "react-d3-tree/lib/types/common";
import { Location } from "react-router-dom";
import { Project, ProjectKnowledgeBase, ProjectKnowledgeNode } from "../domain/domain";
import { AppDispatch, RootState } from "../services/redux/store";
import { ProjectDetails } from "./api";


export interface ProjectKnowledgeNodeDocument {
    fileName: string;
    mimeType: string;
    url: string;
    directory: string;
}

export interface ProjectKnowledgeSection {
    id: string;
    name: string;
    description: string;
    children: string[];
    childNodes?: Partial<KnowledgeNodeDatum>[];
}
export interface KnowledgeNodeAttributes {
    id: string;
    description: string;
    nodeType: string;
    iconName: string;
    status: string;
    durationInSeconds: number;
    longitude: number;
    latitude: number;
    startsAt: number;
    endsAt: number;
    data: string;
    assignees: string[];
    watchers: string[];
    reporter: string;
    sections: ProjectKnowledgeSection[];
    documents: ProjectKnowledgeNodeDocument[];
}
export type KnowledgeNodeDatum = Omit<RawNodeDatum, "children" | "attributes"> & {
    children?: KnowledgeNodeDatum[],
    attributes?: Partial<KnowledgeNodeAttributes>,

};
export type KnowledgeTreeNodeDatum = Omit<TreeNodeDatum, "children"> & {
    children?: KnowledgeNodeDatum,
};
export type TreeNodeType = HierarchyPointNode<KnowledgeNodeDatum>;
export type ActiveNodesType = { [name: string]: TreeNodeType };
export type SetActiveFunction = (active: TreeNodeType | null) => void;
export type SetActiveNodesFunction = (active: ActiveNodesType | SetActiveNodesFunction) => void;
export type MapCoordsType = { latitude: number; longitude: number };
export type GuardPropType = { location: Location; dispatch: AppDispatch; };
export type GuardFunc = (props: GuardPropType) => string | boolean;
export type LayoutProps = {
    children: ReactNode | ReactNode[];
    navbar?: boolean;
    title?: string;
};
export type RouteType = {
    path: string;
    component: LazyExoticComponent<(props: any) => JSX.Element> | null;
    guards?: Array<GuardFunc>;
    layout?: (pros: LayoutProps) => JSX.Element;
    layoutProps?: any;
    children?: RouteType[];
};
export type EmptyNodePlacementType = {
    showForm?: boolean;
    node?: TreeNodeType;
    el?: SVGSVGElement| null;
};
export type NewNodeDataType = {
    id?: string;
    description?: string;
    name: string;
    parentNodeId?: any,
    typeId?: string;
    longitude?: number;
    latitude?: number;
    nodeType?: string;
    iconName?: string;
    status?: string;
    durationInSeconds?: number;
    startsAt?: number;
    data?: any;
};

export type TreeNodeProps = {
    nodeDatum: any; 
    toggleNode?: any;
    nodeSize?: number;
    activeNodes?: ActiveNodesType;
    d3ExtraProps?: any;
    addParentsToActivePath?: SetActiveNodesFunction;
    setActive?: SetActiveFunction;
    active?: string;
    setEmptyNodePlacement?: (placement: EmptyNodePlacementType) => void;
};
export type TreeProjectProps = {
    treeData: any;
    activeNodes?: ActiveNodesType;
    setActiveNodes?: SetActiveNodesFunction;
    active?: TreeNodeType | null;
    setActive?: SetActiveFunction;
    selectedProjectId?: any;
    mapCoords?: MapCoordsType;
    user?: any;
  }
export type TreeNodeAssetProps = {
    fill?: string;
    opacity?: number;
    stroke?: string;
    strokeWidth?: number;
    fillColor?: string;
}

export type ProjectExplorerProps = {
    active?: TreeNodeType | null;
    setActive?: SetActiveFunction;
    activeNodes?: ActiveNodesType;
    setActiveNodes?: SetActiveNodesFunction;
    projects?: any;
    selectedProjectId?: any;
    setSelectedProjectId?: any;
};
export type TokenResponse = {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    user_id: number;
    jti: string;
}
declare global {
    interface Window {
      [key: string]: any;
    }
    namespace JSX {
        interface IntrinsicElements {
          [key: string]: any;
        }
      }
}
declare module 'vuera';

export interface DataTableMetaProps<T> {
    [key: string]: {
        displayName?: string;
        render?: (prop: Partial<T>, id: number, extras?: any) => JSX.Element | string;
    };   
}
export interface DataTableProps<T> {
    caption?: string;
    data: Array<Partial<T>>;
    meta: DataTableMetaProps<Partial<T>>;
    treeMeta: {
        [key: string]: {
            displayName?: string;
            render?: (parent: any, prop: any, id: number) => JSX.Element | string;
        }; 
    };
    newColumn?: {
        renderHeader: () => JSX.Element | string;
        renderData: (index: number) => JSX.Element | string;
    };
    newRow?: {
        render: (name: string, id: number, length?: number) => JSX.Element | string;
    },
    appendColums?: Array<string>;
    groupId?: number | string;
    handleDropItem?: (item?: DragKnowledgeNodeItemType, target?: number | string) => void;
    [key: string]: any,
};
export interface NodeTableData {
    id?: number | string;
    creator?: User;
    parentId?: number;
    name?: string;
    code?: string;
    description?: string;
    picture?: string;
    longitude?: number;
    latitude?: number;
    tree?: ProjectKnowledgeNode;
    children?: Array<KnowledgeNodeDatum>;
    attributes?: any;
};
export interface RepresentationProps {
    nodeId?: string;
    nodeName?: string;
    projectId?: number;
    activeNode?: KnowledgeNodeDatum;
    activeProject?: ProjectDetails & { index?: number };
    selectedProjectId?: string | number;
    onChange?: (prop: any) => void;
    projects?: any;
    [key: string]: any;
};
export type FileResource = {
    key: string,
    size: number,
    owner: string | null,
    lastModifiedAt: string;
}
export type FilesListing = {
    objects: FileResource[],
    commonPrefixes: string[],
}
export type SignedUrlResponse = {
    url: string,
    validitySeconds: number,
    expiresAt: string,
};

