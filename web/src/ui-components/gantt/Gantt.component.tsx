import { useEffect, useRef, useState } from "react";
import Gantt from 'frappe-gantt';
import { ProjectDetails } from "../../typings/api";
import { dateToInputString, getNodeCompletionRate } from "../../utils";
import { useTranslation } from "react-i18next";
import './gantt.scss';
import Overlay from "../overlay/Overlay.component";
import { KnowledgeNodeDatum } from "../../typings";

export interface GanttPropType {
    projects?: Array<ProjectDetails>;
    node?: KnowledgeNodeDatum;
    onUpdateCell?: (props: any) => void;
    isProjectsView?: boolean;
    selectedProjectId?: number | string;
    onChangeRepresentation?: (representation: 'map' | 'gantt' | 'kanban') => void;
}
export interface GanttTask {
    start?: string | Date;
    end?: string | Date;
    name?: string;
    id: string | number;
    progress?: number;
    dependencies?: string | Array<string>;
    title?: string;
    [key: string]: any;
};
export type Bar = {
    $bar: SVGSVGElement;
    $bar_progress: SVGSVGElement;
    $handle_progress: SVGSVGElement;
    action_completed: boolean;
    arrows: Array<unknown>;
    bar_group: SVGSVGElement;
    corner_radius: number;
    duration: number;
    gantt: typeof Gantt;
    group: SVGSVGElement;
    handle_group: SVGSVGElement;
    height: number;
    invalid: boolean;
    progress_width: number;
    task: GanttTask;
    width: number;
    x: number;
    y: number;
}
const today = new Date();
type TFun = (key: string, options?: Record<string, string>) => string;
const parseProjects = (projects: Array<ProjectDetails>, t: TFun = (key: string) => key ): Array<GanttTask> => {
    let tasks: Array<GanttTask> = [];
    projects?.forEach((p) => {
        tasks.push({
            id: p?.tree?.attributes?.id?.toString() ?? p.id,
            start: p?.tree?.attributes?.startsAt ? new Date(p?.tree?.attributes?.startsAt as number) : today,
            end: p?.tree?.attributes?.endsAt ? new Date(p?.tree?.attributes?.endsAt as number) : new Date(today.getFullYear(), today.getMonth() + 1),
            progress: getNodeCompletionRate(p?.tree) * 100,
            name: (p?.tree?.attributes?.status ? t(p?.tree?.attributes?.status?.toString()) + ': ' : '') + (p?.tree?.name ?? p?.name),
            projectId: p.id,
            title: (p?.tree?.name ?? p?.name),
            ...(p?.tree?.attributes ?? {}),
        });
    });
    return tasks;
}
const parseNode = (node: KnowledgeNodeDatum, projectId: number | string, t: TFun = (key: string) => key ): Array<GanttTask> => {
    let tasks: Array<GanttTask> = [];
    node?.children?.forEach((n) => {
        tasks.push({
            id: n?.attributes?.id?.toString(),
            start: n?.attributes?.startsAt ? new Date(n?.attributes?.startsAt as number) : today,
            end: n?.attributes?.endsAt ? new Date(n?.attributes?.endsAt as number) : new Date(today.getFullYear(), today.getMonth() + 1),
            progress: getNodeCompletionRate(n) * 100,
            name: (n?.attributes?.status ? t(n?.attributes?.status?.toString()) + ': ' : '') + n?.name,
            projectId,
            title: n?.name,
            ...(n.attributes ?? {}),
        });
    })
    return tasks;
}
const GanttComponent = ({ projects, node, onUpdateCell , isProjectsView, selectedProjectId, onChangeRepresentation }: GanttPropType) => {
    const ganntRef = useRef<SVGSVGElement>();
    const containerRef = useRef<HTMLDivElement>();
    const [ganntEl, setGanntEl] = useState<typeof Gantt>();
    const [viewMode, setViewMode] = useState('Day');
    const [taskClick, setTaskClick] = useState(false);
    const [viewTask, setViewTask] = useState<GanttTask>();
    const [taskDimension, setTaskDimension] = useState<DOMRect>();
    const [ganttDimension, setGanttDimension] = useState<DOMRect>();
    const debounceId = useRef(-1);
    const { t, i18n } = useTranslation();
    const onViewModeChange = (mode: any) => {
        setViewMode(mode);
    }
    const onClickTask = (task: any) => {
        setViewTask(task);
        if (task?.nodeType === 'empty' && typeof onChangeRepresentation === 'function' && isProjectsView) {
            onChangeRepresentation('map');
        }
        //setTaskClick(true);
    }
    const onDateChange = (task: any, start: any, end: any) => {
        clearTimeout(debounceId.current);
        debounceId.current = window.setTimeout( () => {
            if (onUpdateCell) {
                onUpdateCell({ id: task.projectId, node: { id: task.id, startsAt: new Date(start).getTime(), endsAt: new Date(end).getTime() }});
             }
        }, 1000);
    }
    const initEvents = () => {
        return {
            on_click: onClickTask,
            on_date_change: onDateChange,
            on_progress_change: function(task: any, progress: any) {
                console.log(task, progress);
            },
            on_view_change: onViewModeChange,
            view_mode: viewMode,
            language: i18n.language,
            popup_trigger: 'mouseover',
        }
    }
    const handleChangeViewMode = (mode: string) => {
        if (ganntEl?.change_view_mode) {
            ganntEl.change_view_mode(mode);
        }
    }
    const dismisTaskOverlay = () => {
        setTaskClick(false);
    }
    useEffect(() => {
        if (ganntRef.current) {
            // clear gannt
            if (ganntEl) {
                ganntEl?.clear();
                ganntEl?.hide_popup();
            }
            // create gannt
            const data = isProjectsView ? parseProjects(projects, t) : parseNode(node, selectedProjectId, t);
            const gt = new Gantt("#gantt-frappe-10x", data, initEvents());
            setGanntEl(gt);
            setGanttDimension(ganntRef.current?.getBoundingClientRect());
            const dateLayer = ganntRef.current?.querySelector('.date');
            if (dateLayer) {
                let rect: DOMRect = dateLayer.getBoundingClientRect();
                let containerRect: DOMRect = containerRef.current?.getBoundingClientRect();
                rect.y = rect.bottom - containerRect.y + 7;
                rect.height = ganntRef.current.clientHeight - rect.top;
                setTaskDimension(rect);
            }
        }
    }, [ganntRef, projects, isProjectsView, node]);
    return (
        <div ref={containerRef} id="gantt-frappe-wrapper-10x" style={{ marginLeft: 15, position: 'relative' }}>
            <div className="gantt-btn-group">
                {
                    ['Day', 'Week', 'Month'].map((mode: string) => <button className={`gantt-btn ${viewMode === mode ? 'active' : ''}`} key={mode} onClick={() => handleChangeViewMode(mode)}>{t(mode)}</button>)
                }
            </div>
            <div style={{ 
                top: taskDimension?.y,
                height: taskDimension?.height,
                display: 'flex',
                flexDirection: 'column',
            }} className="task-layer">
                {
                    ganntEl?.bars?.length > 0 ? (
                        ganntEl.bars?.map(
                            (bar: Bar) => {
                                return (
                                    <div style={{
                                        position: 'absolute',
                                        top: bar?.y - 65,
                                    }} key={bar?.task?.id}>
                                        {bar?.task?.title}
                                    </div>
                                )
                            }
                        )
                    ) : null
                }
            </div>
            <svg ref={ganntRef} id="gantt-frappe-10x" />
            {
                taskClick ? (
                    (
                        <Overlay show={taskClick} el="#representation-container-10x" container="#representation-container-10x" onDismiss={dismisTaskOverlay}>
                            <div>
                                <div>{viewTask?.name}</div>
                                <div className="gantt-control-wrapper">
                                    <label htmlFor="start">{t('start')}</label>
                                    <input id="start" className="gantt-input" type="date" defaultValue={viewTask?.startsAt ? dateToInputString(new Date(viewTask?.startsAt)) : dateToInputString(today)} />
                                </div>
                                <div className="gantt-control-wrapper">
                                    <label htmlFor="end">{t('end')}</label>
                                    <input id="end" className="gantt-input" type="date" defaultValue={viewTask?.endsAt ? dateToInputString(new Date(viewTask?.endsAt)) : dateToInputString(new Date(today.getFullYear(), today.getMonth() + 1))} />
                                </div>
                            </div>
                        </Overlay>
                    )
                ) : null
            }
        </div>
    );
};

export default GanttComponent;
