import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Status, Priority } from '@/types/tasks'


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
    searchQuery: string
    sortOrder: 'asc' | 'desc'
    setSelectedTask: (id: number | null) => void
    setComment: (comment: string) => void
    setSearchQuery: (query: string) => void
    toggleSortOrder: () => void
    updateTaskStatus: (id: number, status: Status, comment: string) => void
    getNextTask: (currentId: number) => Task | null
    getPreviousTask: (currentId: number) => Task | null
    createTask: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => void
}

export const useTaskStore = create(
    persist<TaskStore>(
        (set, get) => ({
            tasks: mockTasks,
            selectedTaskId: null,
            comment: '',
            searchQuery: '',
            sortOrder: 'desc',
            setSelectedTask: (id) => set({ selectedTaskId: id }),
            setComment: (comment) => set({ comment }),
            setSearchQuery: (query) => set({ searchQuery: query }),
            toggleSortOrder: () => set((state) => ({
                sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc'
            })),
            updateTaskStatus: (id, status, comment) =>
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id
                            ? { ...task, status, comment, updated_at: new Date().toISOString() }
                            : task
                    ),
                })),
            getNextTask: (currentId) => {
                const tasks = get().tasks
                const currentIndex = tasks.findIndex(task => task.id === currentId)
                return tasks[currentIndex + 1] || null
            },
            getPreviousTask: (currentId) => {
                const tasks = get().tasks
                const currentIndex = tasks.findIndex(task => task.id === currentId)
                return tasks[currentIndex - 1] || null
            },
            createTask: (taskData) => set((state) => ({
                tasks: [...state.tasks, {
                    ...taskData,
                    id: Math.max(0, ...state.tasks.map(t => t.id)) + 1,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                }]
            })),
        }),
        {
            name: 'task-storage',
        }
    ))