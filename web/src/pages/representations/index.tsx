import { FilesView } from "./files-view/FilesView.component";
import IFCContainer from "./forge-viewer/ifc_container";
import GanttView from "./gantt-view/GanttView.component";
import KanbanView from "./kanban-view/KanbanView.component";
import MapLayers from "./map-component/map";
export default {
    model_3d: IFCContainer,
    map: MapLayers,
    kanban: KanbanView,
    gantt: GanttView,
    files: FilesView,
};
