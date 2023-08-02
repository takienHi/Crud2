import { UserType } from './UserType';

export type TaskType = {
    id?: string | number;
    title: string;
    description: string;
    status: TaskStatusType;
    userId?: string | number;

    user?: UserType;
};

export type TaskStatusType = 'incomplete' | 'completed';
