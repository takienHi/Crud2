import http from '../utils/http-common';
import { UserType as IUserData } from '../types/UserType';

const getAll = async (filterString: string) => {
    if (filterString) {
        return await http.get<Array<IUserData>>('/users/?' + filterString + 'role_ne=admin&_sort=id&_order=desc');
    }
    return await http.get<Array<IUserData>>('/users/?role_ne=admin&_sort=id&_order=desc');
};

const checkUserNameUnique = async (filterString: string) => {
    let check = true;
    if (filterString) {
        await http
            .get<Array<IUserData>>('/users/?userName=' + filterString)
            .then((response: any) => {
                if (response.data.length >= 1) {
                    check = false;
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    return check;
};

const checkEmailUnique = async (filterString: string) => {
    let check = true;
    if (filterString) {
        await http
            .get<Array<IUserData>>('/users/?email=' + filterString)
            .then((response: any) => {
                console.log('response: ', response);

                if (response.data[0] !== undefined) {
                    console.log(typeof response.data[0]);
                    check = false;
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    return check;
};

const getById = (id: string) => {
    return http.get<IUserData>(`/users/${id}`);
};

const create = (data: IUserData) => {
    console.log(data);
    return http.post<IUserData>('/users', data);
};

const update = (id: any, data: IUserData) => {
    return http.put<any>(`/users/${id}`, data);
};

const update2 = (id: any, data: object) => {
    return http.patch<any>(`/users/${id}`, data);
};

const remove = (id: any) => {
    return http.delete<any>(`/users/${id}`);
};

const removeAll = () => {
    return http.delete<any>(`/users`);
};

const findByTitle = (title: string) => {
    return http.get<Array<IUserData>>(`/users?title=${title}`);
};

const UserApi = {
    getAll,
    checkUserNameUnique,
    checkEmailUnique,
    getById,
    create,
    update,
    update2,
    remove,
    removeAll,
    findByTitle
};

export default UserApi;
