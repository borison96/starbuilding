export const GanttData = {
    data: [
        {
            TaskID: 1,
            TaskName: 'Project Initiation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 2, TaskName: 'Identify Site location', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                { TaskID: 3, TaskName: 'Perform Soil test', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
                { TaskID: 4, TaskName: 'Soil test approval', StartDate: new Date('04/02/2019'), Duration: 4, Progress: 50 },
            ]
        },
        {
            TaskID: 5,
            TaskName: 'Project Estimation',
            StartDate: new Date('04/02/2019'),
            EndDate: new Date('04/21/2019'),
            subtasks: [
                { TaskID: 6, TaskName: 'Develop floor plan for estimation', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                { TaskID: 7, TaskName: 'List materials', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 },
                { TaskID: 8, TaskName: 'Estimation approval', StartDate: new Date('04/04/2019'), Duration: 3, Progress: 50 }
            ]
        },
    ],
    raw: [
        {
            id: 1,
            name: 'Project Initiation',
            start: new Date('04/02/2019'),
            end: new Date('04/21/2019'),
            dependencies: [2, 3, 4]
        },
        {
            id: '5',
            name: 'Project Estimation',
            start: new Date('04/02/2019'),
            end: new Date('04/21/2019'),
            dependencies: ['6', '7', '8']
        },
        { id: '6', name: 'Develop floor plan for estimation', start: new Date('04/04/2019'), duration: 3, progress: 50 },
        { id: '7', name: 'List materials', start: new Date('04/04/2019'), duration: 3, progress: 50 },
        { id: '8', name: 'Estimation approval', start: new Date('04/04/2019'), duration: 3, progress: 50 }
    ],
    frappe: {
        data: [
            {
                start: '2018-10-01',
                end: '2018-10-08',
                name: 'Redesign website',
                id: "Task 0",
                progress: 20
            },
            {
                start: '2018-10-03',
                end: '2018-10-06',
                name: 'Write new content',
                id: "Task 1",
                progress: 5,
                dependencies: 'Task 0'
            },
            {
                start: '2018-10-04',
                end: '2018-10-08',
                name: 'Apply new styles',
                id: "Task 2",
                progress: 10,
                dependencies: 'Task 1'
            },
            {
                start: '2018-10-08',
                end: '2018-10-09',
                name: 'Review',
                id: "Task 3",
                progress: 5,
                dependencies: 'Task 2'
            },
            {
                start: '2018-10-08',
                end: '2018-10-10',
                name: 'Deploy',
                id: "Task 4",
                progress: 0,
                dependencies: 'Task 2'
            },
            {
                start: '2018-10-11',
                end: '2018-10-11',
                name: 'Go Live!',
                id: "Task 5",
                progress: 0,
                dependencies: 'Task 4',
                custom_class: 'bar-milestone'
            },
        ],
        config: {
            on_click: function (task: any) {
                console.log(task);
            },
            on_date_change: function(task: any, start: any, end: any) {
                console.log(task, start, end);
            },
            on_progress_change: function(task: any, progress: any) {
                console.log(task, progress);
            },
            on_view_change: function(mode: any) {
                console.log(mode);
            },
            view_mode: 'Day',
            language: 'en'
        },
    },
    taskFields: {
        id: 'TaskID',
        name: 'TaskName',
        startDate: 'StartDate',
        duration: 'Duration',
        progress: 'Progress',
        child: 'subtasks',
    }
};
