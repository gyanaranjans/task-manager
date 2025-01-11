export type Status = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';
export type Priority = 'HIGH' | 'MEDIUM' | 'LOW';

export type Task = {
    id: number;
    name: string;
    labels: string[];
    status: Status;
    priority: Priority;
    assignee: string;
    due_date: string;
    created_at: string;
    updated_at: string;
    comment?: string;
};