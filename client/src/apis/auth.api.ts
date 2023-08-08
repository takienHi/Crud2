import http from '../utils/http-common';
import { UserType as IUserData } from '../types/UserType';
import { LoginSchema } from 'src/schema/authSchema';
import { ResultApiType } from 'src/types/ResultApiType';

const loginGoogle = async (response: any) => {
    const result: ResultApiType = {
        check: false,
        message: 'Your account is not registered',
        data: {}
    };

    await http
        .get<IUserData>(`/users/?email=${response.email}`)
        .then((response: any) => {
            if (response.data[0] && response.data[0].status === 'active') {
                const data = response.data[0];

                result.check = true;
                result.message = 'Login successfully!';
                result.data = data;
            } else {
                result.check = false;
                result.message = 'Your account has been locked!';
            }
        })
        .catch((e: Error) => {
            console.log(e);
        });

    return result;
};

const login2 = async (formValues: LoginSchema) => {
    const result: ResultApiType = {
        check: false,
        message: 'The account or password is incorrect',
        data: {}
    };

    await http
        .get<IUserData>(`/users/?email=${formValues.email}&password=${formValues.password}`)
        .then((response: any) => {
            console.log(response.data[0]);

            if (response.data[0].status === 'active') {
                const data = response.data[0];

                result.check = true;
                result.message = 'Login successfully!';
                result.data = data;
            } else {
                result.check = false;
                result.message = 'Your account has been locked!';
            }
        })
        .catch((e: Error) => {
            console.log(e);
        });

    await http
        .get<IUserData>(`/users/?userName=${formValues.email}&password=${formValues.password}`)
        .then((response: any) => {
            if (response.data[0].status === 'active') {
                const data = response.data[0];

                result.check = true;
                result.message = 'Login successfully!';
                result.data = data;
            } else {
                result.check = false;
                result.message = 'Your account has been locked!';
            }
        })
        .catch((e: Error) => {
            console.log(e);
        });
    return result;
};

const register = async (user: IUserData) => {
    const result: ResultApiType = {
        check: true,
        message: 'account successfully created',
        data: {}
    };

    await http
        .get<Array<IUserData>>('/users/?userName=' + user.userName)
        .then((response: any) => {
            if (response.data[0]) {
                result.check = false;
                result.message = 'username already exists';
            }
        })
        .catch((e: Error) => {
            console.log(e);
        });

    if (result.check) {
        await http
            .get<Array<IUserData>>('/users/?email=' + user.email)
            .then((response: any) => {
                if (response.data[0] !== undefined) {
                    result.check = false;
                    result.message = 'email already exists';
                }
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }
    if (result.check) {
        http.post<IUserData>('/users', user);
    }

    return result;
};

const registerGoogle = async (user: IUserData) => {
    const result: ResultApiType = {
        check: true,
        message: 'account successfully created',
        data: {}
    };

    http.post<IUserData>('/users', user);

    return result;
};
const AuthApi = {
    loginGoogle,
    login2,
    register,
    registerGoogle
};
export default AuthApi;
