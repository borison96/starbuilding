
export interface BaseEntity {
    id: number;
    version: number;
}

export interface BaseEntityWithAudit extends BaseEntity {
    createdAt: Date;
    updatedAt: Date;
}

export interface JsonWrapper<T> {
    values: T;
}

export interface OrgJoinRequest extends ProjectInvitation {
    userId: number;
    user: User;
}

export interface OrgMemberKey extends Serializable {
    orgId: number;
    memberId: number;
}

export interface OrgMemberRelation {
    id: OrgMemberKey;
    orgRoleId: number;
}

export interface OrgRole extends BaseEntity {
    name: string;
    description: string;
}

export interface Organisation extends BaseEntityWithAudit {
    creatorId: number;
    joinRequests: JsonWrapper<OrgJoinRequest[]>;
    name: string;
    code: string;
    description: string;
    picture: string;
    address: string;
    corporateName: string;
    sector: string;
    legalStructure: string;
    postalCode: string;
    town: string;
    region: string;
    country: string;
}

export interface OrganisationContext {
}

export interface CreateOrganisation {
    name: string;
    code: string;
    description: string;
    picture: string;
    address: string;
    corporateName: string;
    sector: string;
    legalStructure: string;
    postalCode: string;
    town: string;
    region: string;
    country: string;
}

export interface Project extends BaseEntityWithAudit {
    creatorId: number;
    parentId: number;
    name: string;
    code: string;
    description: string;
    picture: string;
    longitude: number;
    latitude: number;
    invitations: JsonWrapper<ProjectInvitation[]>;
}

export interface ProjectInvitation {
    token: string;
    roleId: number;
    createdAt: number;
    expiresInDays: number;
    email: string;
    link: string;
}

export interface ProjectKnowledgeBase extends BaseEntity {
    projectId: number;
    tree: ProjectKnowledgeNode;
}

export interface ProjectKnowledgeBaseHelper {
    knowledgeBase: ProjectKnowledgeBase;
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
    endsAt: number;
    data: string;
    assignees: string[];
    watchers: string[];
    reporter: string;
    sections: ProjectKnowledgeSection[];
    documents: ProjectKnowledgeNodeDocument[];
}

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
}

export interface ProjectMemberKey extends Serializable {
    projectId: number;
    memberId: number;
}

export interface ProjectMemberRelation {
    projectRoleId: number;
}

export interface ProjectNodeStatus extends BaseEntity {
    label: string;
    iconName: string;
}

export interface ProjectNodeType extends BaseEntity {
    creatorId: number;
    label: string;
    iconName: string;
}

export interface ProjectOrgKey extends Serializable {
    organisationId: number;
    projectId: number;
}

export interface ProjectOrgRelation {
    id: ProjectOrgKey;
}

export interface ProjectRole extends BaseEntity {
    name: string;
    description: string;
}

export interface CreateProjectForm {
    name: string;
    description: string;
    longitude: number;
    latitude: number;
    status: string;
    picture: string;
}

export interface CreateProjectNodeForm {
    typeId: number;
    name: string;
    description: string;
    parentNodeId: string;
    longitude: number;
    latitude: number;
    nodeType: string;
    iconName: string;
    status: string;
    durationInSeconds: number;
    startsAt: number;
    endsAt: number;
    data: string;
}

export interface ProjectInvite {
    email: string;
    roleId: number;
}

export interface ProjectInviteForm {
    invitations: ProjectInvite[];
}

export interface UpdateProjectNodeForm {
    id: string;
    name: string;
    description: string;
    iconName: string;
    status: string;
    durationInSeconds: number;
    longitude: number;
    latitude: number;
    startsAt: number;
    endsAt: number;
    data: string;
    sections: ProjectKnowledgeSection[];
}

export interface Competence extends BaseEntity {
    codeRome: string;
    appellation: string;
}

export interface Domaine extends BaseEntity {
    codeRome: string;
    appellation: string;
}

export interface Profession extends BaseEntity {
    codeRome: string;
    appellation: string;
    codeOgr: string;
}

export interface Section {
    id: SectionKey;
    name: string;
    description: string;
    children: JsonWrapper<number[]>;
}

export interface SectionKey extends Serializable {
}

export interface Seeder extends BaseEntity {
    tableName: string;
    status: boolean;
}

export interface Role extends BaseEntity {
    name: string;
    authorities: string;
}

export interface User extends BaseEntityWithAudit {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    roleId: number;
    phoneFixed: string;
    portfolioUrl: string;
    userType: string;
    emailVerifiedAt: Date;
}

export interface RoleRepository extends JpaRepository<Role, number> {
}

export interface SeederRepository extends JpaRepository<Seeder, number> {
}

export interface UserRepository extends JpaRepository<User, number> {
}

export interface OrgMemberRelationRepository extends JpaRepository<OrgMemberRelation, OrgMemberKey> {
}

export interface OrgRoleRepository extends JpaRepository<OrgRole, number> {
}

export interface OrganisationRepository extends JpaRepository<Organisation, number> {
}

export interface ProjectKnowledgeBaseRepository extends JpaRepository<ProjectKnowledgeBase, number> {
}

export interface ProjectMemberRelationRepository extends JpaRepository<ProjectMemberRelation, ProjectMemberKey> {
}

export interface ProjectNodeStatusRepository extends JpaRepository<ProjectNodeStatus, number> {
}

export interface ProjectNodeTypeRepository extends JpaRepository<ProjectNodeType, number> {
}

export interface ProjectOrgRelationRepository extends JpaRepository<ProjectOrgRelation, ProjectOrgKey> {
}

export interface ProjectRepository extends JpaRepository<Project, number> {
}

export interface ProjectRoleRepository extends JpaRepository<ProjectRole, number> {
}

export interface CompetenceRepository extends JpaRepository<Competence, number> {
}

export interface DomainRepository extends JpaRepository<Domaine, number> {
}

export interface ProfessionRepository extends JpaRepository<Profession, number> {
}

export interface ListValueRequest<T> {
    values: T[];
}

export interface LoginDAO {
    username: string;
    password: string;
}

export interface ROMELocalSearch {
    libelle: string;
    nombre: number;
    type: string;
    codeRome: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterUserDAO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    phoneFixed: string;
    portfolioUrl: string;
    userType: string;
}

export interface SingleValue {
    value: string;
}

export interface UpdateUserDetailsDAO {
    firstName: string;
    lastName: string;
    phone: string;
    phoneFixed: string;
    portfolioUrl: string;
}

export interface CreateDocumentNodeRequest {
    name: string;
    description: string;
    parentNodeId: string;
    file: any;
    fileName: string;
    prefix: string;
}

export interface ApiResponse<T> {
    content: T;
    errors: T[];
}

export interface ApiResponseError extends RuntimeException {
    response: ApiResponse<any>;
}

export interface ROMELocalRecord {
    libelle: string;
    domaine: string;
    competence: string;
    metier: string;
    codeROME: string;
    reference: string;
}

export interface UserDAO {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    roleId: number;
    phoneFixed: string;
    portfolioUrl: string;
    userType: string;
    emailVerifiedAt: Date;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface CheckStatusDTO {
    urn: string;
    status: string;
    progress: string;
}

export interface ForgeUpload {
}

export interface OutputInfo {
    destination: Region;
    formats: Format[];
}

export interface Format {
    type: string;
    views: string[];
}

export interface Region {
    region: string;
}

export interface URNInfo {
    urn: string;
    rootFilename: string;
    compressedUrn: boolean;
}

export interface objectForgeDTO {
    bucketKey: string;
    objectId: string;
    objectKey: string;
    size: any;
    contentType: string;
    location: string;
}

export interface translateDTO {
    result: string;
    urn: string;
}

export interface translateForm {
    input: URNInfo;
    output: OutputInfo;
}

export interface uploadURLDTO {
    uploadKey: string;
    uploadExpiration: string;
    urlExpiration: string;
    urls: string[];
}

export interface OrgListMemberResponse {
    organisations: Organisation[];
    memberRoleRelations: OrgMemberRelation[];
    roles: OrgRole[];
    pageInfo: Page<OrgMemberRelation>;
}

export interface OrgMemberListResponse {
    members: User[];
    memberRoleRelations: OrgMemberRelation[];
    roles: OrgRole[];
    pageInfo: Page<OrgMemberRelation>;
}

export interface OrgMemberResponse {
    organisation: Organisation;
    member: User;
}

export interface ProjectListResponse {
    projects: Project[];
    knowledgeBaseMap: { [index: string]: ProjectKnowledgeBase };
    creatorMap: { [index: string]: User };
}

export interface ProjectResponse {
    project: Project;
    knowledgeBase: ProjectKnowledgeBase;
}

export interface Serializable {
}

export interface RuntimeException extends Exception {
}

export interface Page<T> extends Slice<T> {
    totalPages: number;
    totalElements: number;
}

export interface JpaRepository<T, ID> extends PagingAndSortingRepository<T, ID>, QueryByExampleExecutor<T> {
}

export interface Throwable extends Serializable {
    cause: Throwable;
    stackTrace: StackTraceElement[];
    message: string;
    suppressed: Throwable[];
    localizedMessage: string;
}

export interface StackTraceElement extends Serializable {
    classLoaderName: string;
    moduleName: string;
    moduleVersion: string;
    methodName: string;
    fileName: string;
    lineNumber: number;
    nativeMethod: boolean;
    className: string;
}

export interface Exception extends Throwable {
}

export interface Sort extends Streamable<Order>, Serializable {
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    offset: number;
    sort: Sort;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Slice<T> extends Streamable<T> {
    last: boolean;
    size: number;
    content: T[];
    number: number;
    sort: Sort;
    numberOfElements: number;
    pageable: Pageable;
    first: boolean;
}

export interface PagingAndSortingRepository<T, ID> extends CrudRepository<T, ID> {
}

export interface QueryByExampleExecutor<T> {
}

export interface Streamable<T> extends Iterable<T>, Supplier<Stream<T>> {
    empty: boolean;
}

export interface Order extends Serializable {
    direction: Direction;
    property: string;
    ignoreCase: boolean;
    nullHandling: NullHandling;
    ascending: boolean;
    descending: boolean;
}

export interface CrudRepository<T, ID> extends Repository<T, ID> {
}

export interface Iterable<T> {
}

export interface Supplier<T> {
}

export interface Stream<T> extends BaseStream<T, Stream<T>> {
}

export interface Repository<T, ID> {
}

export interface BaseStream<T, S> extends AutoCloseable {
    parallel: boolean;
}

export interface AutoCloseable {
}

export type ActionType = "INSERT" | "UPDATE" | "DELETE" | "READ";

export type Direction = "ASC" | "DESC";

export type NullHandling = "NATIVE" | "NULLS_FIRST" | "NULLS_LAST";
