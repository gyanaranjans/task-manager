import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Status, Priority } from '@/types/tasks'

type SortConfig = {
    column: keyof Task
    direction: 'asc' | 'desc'
}

type SearchConfig = {
    column: keyof Task
    query: string
}
const mockTasks: Task[] = [
    {
        id: 1,
        name: "Implement search feature",
        labels: ["frontend", "urgent"],
        status: "OPEN",
        priority: "HIGH",
        assignee: "john@example.com",
        due_date: "2024-03-30T00:00:00Z",
        created_at: "2024-03-15T00:00:00Z",
        updated_at: "2024-03-15T00:00:00Z",
    },
    {
        id: 2,
        name: "Fix navigation bug",
        labels: ["bug", "frontend"],
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: "jane@example.com",
        due_date: "2024-03-25T00:00:00Z",
        created_at: "2024-03-14T00:00:00Z",
        updated_at: "2024-03-14T00:00:00Z",
    },
    {
        id: 3,
        name: "Deploy to production",
        labels: ["devops"],
        status: "CLOSED",
        priority: "HIGH",
        assignee: "devops@example.com",
        due_date: "2024-03-20T00:00:00Z",
        created_at: "2024-03-10T00:00:00Z",
        updated_at: "2024-03-10T00:00:00Z",
    }
]

interface TaskStore {
    tasks: Task[]
    selectedTaskId: number | null
    comment: string
    sortConfig: SortConfig
    searchConfig: SearchConfig
    setSearchConfig: (config: SearchConfig) => void
    setSortConfig: (config: SortConfig) => void
    createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
    setSelectedTask: (id: number | null) => void
    setComment: (comment: string) => void
    toggleSortOrder: () => void
    getNextTask: (currentId: number) => Task | null
    getPreviousTask: (currentId: number) => Task | null
    updateTaskStatus: (id: number, status: Status, comment: string) => void
    pagination: {
        page: number;
        hasMore: boolean;
    };
    loadMore: () => void;
    clearSearch: () => void;
    clearSort: () => void;
}

export const useTaskStore = create(
    persist<TaskStore>(
        (set, get) => ({
            tasks: mockTasks,
            selectedTaskId: null,
            comment: '',
            sortConfig: {
                column: 'created_at',
                direction: 'desc'
            },
            searchConfig: {
                column: 'name',
                query: ''
            },
            setSearchConfig: (config) => set({ searchConfig: config }),
            setSortConfig: (config) => set({ sortConfig: config }),
            createTask: (taskData) => set((state) => ({
                tasks: [...state.tasks, {
                    ...taskData,
                    id: Math.max(0, ...state.tasks.map(t => t.id)) + 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }]
            })),
            setSelectedTask: (id) => set({ selectedTaskId: id }),
            setComment: (comment) => set({ comment }),
            updateTaskStatus: (id, status, comment) => set((state) => ({
                tasks: state.tasks.map((task) =>
                    task.id === id
                        ? { ...task, status, comment, updated_at: new Date().toISOString() }
                        : task
                ),
            })),
            getNextTask: (currentId: number) => {
                const tasks = get().tasks;
                const currentIndex = tasks.findIndex(task => task.id === currentId);
                return tasks[currentIndex + 1] || null;
            },
            getPreviousTask: (currentId: number) => {
                const tasks = get().tasks;
                const currentIndex = tasks.findIndex(task => task.id === currentId);
                return tasks[currentIndex - 1] || null;
            },
            toggleSortOrder: () => set((state) => ({
                sortConfig: {
                    ...state.sortConfig,
                    direction: state.sortConfig.direction === 'asc' ? 'desc' : 'asc'
                }
            })),
            pagination: {
                page: 1,
                hasMore: true
            },
            loadMore: () => set((state) => ({
                pagination: {
                    page: state.pagination.page + 1,
                    hasMore: state.tasks.length > (state.pagination.page + 1) * 10
                }
            })),
            clearSearch: () => set({
                searchConfig: {
                    column: 'name',
                    query: ''
                }
            }),
            clearSort: () => set({
                sortConfig: { column: 'created_at', direction: 'desc' }
            })
        }),
        {
            name: 'task-storage',
        }
    )
)