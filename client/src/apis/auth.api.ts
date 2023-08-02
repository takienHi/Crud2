import http from '../utils/http-common';
import { UserType as IUserData } from '../types/UserType';
import { LoginSchema } from 'src/schema/authSchema';
import { ResultApiType } from 'src/types/ResultApiType';

const login = (email: string, password: string) => {
    return http.get<IUserData>(`/users/?email=${email}&password=${password}`);
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
            if (response.data[0]) {
                const data = response.data[0];

                result.check = true;
                result.message = 'Login successfully!';
                result.data = data;
            }
        })
        .catch((e: Error) => {
            console.log(e);
        });

    await http
        .get<IUserData>(`/users/?userName=${formValues.email}&password=${formValues.password}`)
        .then((response: any) => {
            if (response.data[0]) {
                const data = response.data[0];
                result.check = true;
                result.message = 'Login successfully!';
                result.data = data;
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

const AuthApi = {
    login,
    login2,
    register
};
export default AuthApi;
