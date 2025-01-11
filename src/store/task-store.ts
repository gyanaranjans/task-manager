import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Task, Status, mockTasks } from '@/types/tasks'

type SortConfig = {
    column: keyof Task
    direction: 'asc' | 'desc'
}

type SearchConfig = {
    column: keyof Task
    query: string
}


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
        currentPage: number;
        pageSize: number;
        totalPages: number;
    };
    setCurrentPage: (page: number) => void;

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
                currentPage: 1,
                pageSize: 10,
                totalPages: Math.ceil(mockTasks.length / 10)
            },
            setCurrentPage: (page) => set((state) => ({
                pagination: {
                    ...state.pagination,
                    currentPage: page
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
            version: 1,
            skipHydration: false
        }
    )
)