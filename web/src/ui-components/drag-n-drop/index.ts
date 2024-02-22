import { KnowledgeNodeAttributes } from "../../typings";

export type DragKnowledgeNodeItemType = {
    name?: string;
    groupId?: number | string;
} & Partial<KnowledgeNodeAttributes>;
