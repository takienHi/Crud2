import { TaskStatusType } from 'src/types/TaskType';
import { regexAlphabet } from 'src/utils/regexs';
import * as yup from 'yup';

export const taskSchema = yup.object().shape({
    title: yup.string().required().min(6).max(200),
    description: yup.string().required(),
    status: yup.mixed<TaskStatusType>().oneOf(['incomplete', 'completed']).required()
});

export type TaskSchema = yup.InferType<typeof taskSchema>;

// export const editUserSchema = yup.object().shape({
//     fullName: yup.string().required().min(6).max(100),
//     status: yup.string().required()
// });

// export type EditUserSchema = yup.InferType<typeof editUserSchema>;

export const passwordFormSchema = yup.object().shape({
    password: yup.string().required().min(6).max(25).matches(regexAlphabet, 'Only alphabet and number'),
    passwordConfirm: yup
        .string()
        .required()
        .oneOf([yup.ref('password')], ' Confirm password is incorrect!')
});

export type PasswordFormSchema = yup.InferType<typeof passwordFormSchema>;
