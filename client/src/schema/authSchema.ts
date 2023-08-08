import UserApi from 'src/apis/user.api';
import { regexAlphabet, regexUserName } from 'src/utils/regexs';
import * as yup from 'yup';

export const registerSchema = yup.object({
    fullName: yup
        .string()
        .required()
        .matches(/^([A-Za-z\u00C0-\u00D6\u00D8-\u00f6\u00f8-\u00ff\s]*)$/gi, 'Name can only contain Latin letters.')
        .matches(/^\s*[\S]+(\s[\S]+)+\s*$/gms, 'Please enter your full name.'),
    userName: yup.string().lowercase().required().min(2).max(20).matches(regexAlphabet, 'Only alphabet and number'),
    email: yup.string().required().email().lowercase(),
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number'),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], ' Confirm password is incorrect!')
});

export type RegisterSchema = yup.InferType<typeof registerSchema>;

export const loginSchema = yup.object({
    email: yup.string().required().lowercase(),
    password: yup.string().required()
});

export type LoginSchema = yup.InferType<typeof loginSchema>;

export const registerByGoogleSchema = yup.object({
    fullName: yup.string().required().min(2).max(100),
    userName: yup
        .string()
        .lowercase()
        .required()
        .min(2)
        .max(20)
        .matches(regexUserName, 'Name can only contain letters.')
        .test('Unique UserName', 'UserName already in use', function (item) {
            return UserApi.checkUserNameUnique(item);
        })
});

export type RegisterByGoogleSchema = yup.InferType<typeof registerByGoogleSchema>;
