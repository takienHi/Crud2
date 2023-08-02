import http from '../utils/http-common';
import { TaskType as ITaskData } from '../types/TaskType';

const getAll = async (filterString: string) => {
    if (filterString) {
        return await http.get<Array<ITaskData>>(
            '/tasks/?_expand=user&' + filterString + '_sort=status,id&_order=desc,desc'
        );
    }
    return await http.get<Array<ITaskData>>('/tasks/?_expand=user&_sort=status,id&_order=desc,desc');
};

const getById = (id: string) => {
    return http.get<ITaskData>(`/tasks/${id}?_expand=user`);
};

const getByUserId = (id: any, filterString: string) => {
    if (filterString) {
        return http.get<Array<ITaskData>>(
            `/tasks/?_expand=user&${filterString}userId=${id}&_sort=status,id&_order=desc,desc`
        );
    }
    return http.get<ITaskData>(`/tasks/?_expand=user&userId=${id}&_sort=status,id&_order=desc,desc`);
};

const create = (data: ITaskData) => {
    return http.post<ITaskData>('/tasks', data);
};

const update = (id: any, data: ITaskData) => {
    return http.put<any>(`/tasks/${id}`, data);
};

const update2 = (id: any, data: object) => {
    return http.patch<any>(`/tasks/${id}`, data);
};

const remove = (id: any) => {
    return http.delete<any>(`/tasks/${id}`);
};

const TaskApi = {
    getAll,
    getByUserId,
    getById,
    create,
    update,
    update2,
    remove
};

export default TaskApi;
