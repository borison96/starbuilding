import { useDispatch, useSelector } from "../../../hooks";
import { RepresentationProps } from "../../../typings";
import KanbanComponent from "../../../ui-components/kanban/Kanban.component";

const KanbanView = ({ activeNode, projects, activeProject, projectId, ...props }: RepresentationProps) => {
    const projectNodeStatuses  = useSelector(state => state.projectNodeStatuses);
    const { scrollId }  = useSelector(state => state.kanbanMeta);
    const viewType = useSelector(state => state.kanbanMeta.viewType);
    const isListView = viewType === 'list';
    const columns = projectNodeStatuses?.payload?.filter(s => ['todo', 'in-progress', 'done', 'delivered', 'blocked'].includes(s.label)) ??
                    ['todo', 'in-progress', 'done', 'delivered', 'blocked'].map(k => ({ id: k, label: k, iconName: k }));
    return (
        !activeNode ? (
            isListView ? (
                <div style={{ marginLeft: 15 }}>
                    {
                        projects?.map((p: any) => {
                            if (p?.tree) {
                                return (
                                    <details key={p?.tree?.attributes?.id ?? p?.id} open={activeProject?.id === p?.id}>
                                        <summary>{p?.tree?.name ?? p?.tree?.attributes?.description}</summary>
                                        <KanbanComponent
                                            showDates
                                            projectId={p?.id}
                                            scrollId={scrollId}
                                            {...props}
                                            kanban={{ columns, data: p?.tree?.children}}
                                        />
                                    </details>
                                )
                            }
                            return <span />;
                        })
                    }
                </div>
            ) : (
                <KanbanComponent
                    showDates
                    scrollId={scrollId}
                    {...props}
                    kanban={{
                        columns: ['todo', 'started', 'completed'].map(k => ({ id: k, label: k, iconName: k })),
                        data: projects
                    }}
                />
            )
        ) : <KanbanComponent projectId={activeProject?.id} showDates scrollId={scrollId} {...props} kanban={{ columns, data: activeNode?.children }} />
    );
};

export default KanbanView;