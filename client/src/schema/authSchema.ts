import { regexAlphabet } from 'src/utils/regexs';
import * as yup from 'yup';

export const registerSchema = yup.object({
    fullName: yup.string().required(),
    userName: yup.string().required().min(2).max(20).matches(regexAlphabet, 'Only alphabet and number'),
    email: yup.string().required().email(),
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number'),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], ' Confirm password is incorrect!')
});

export type RegisterSchema = yup.InferType<typeof registerSchema>;

export const loginSchema = yup.object({
    email: yup.string().required().min(5).max(100),
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number')
});

export type LoginSchema = yup.InferType<typeof loginSchema>;
