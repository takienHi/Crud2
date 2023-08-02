import UserApi from 'src/apis/user.api';
import { RoleType } from 'src/types/UserType';
import { regexAlphabet } from 'src/utils/regexs';
import * as yup from 'yup';

export const createUserSchema = yup.object().shape({
    fullName: yup.string().required().min(6).max(100),
    role: yup.mixed<RoleType>().oneOf(['admin', 'manager', 'employee']).required(),
    userName: yup
        .string()
        .required()
        .min(2)
        .max(20)
        .matches(regexAlphabet, 'Only alphabet and number')
        .test('Unique Email', 'Email already in use', function (item) {
            return UserApi.checkUserNameUnique(item);
        }),
    email: yup
        .string()
        .required()
        .email()
        .test('Unique Email', 'Email already in use', function (item) {
            return UserApi.checkEmailUnique(item);
        }),
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number'),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], ' Confirm password is incorrect!')
});

export type CreateUserSchema = yup.InferType<typeof createUserSchema>;

export const editUserSchema = yup.object().shape({
    fullName: yup.string().required().min(6).max(100),
    status: yup.string().required()
});

export type EditUserSchema = yup.InferType<typeof editUserSchema>;

export const passwordFormSchema = yup.object().shape({
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number'),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], ' Confirm password is incorrect!')
});

export type PasswordFormSchema = yup.InferType<typeof passwordFormSchema>;
