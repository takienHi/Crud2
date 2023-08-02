export type UserType = {
    id?: string;
    fullName: string;
    userName: string;
    email: string;
    role: RoleType;
    password: string;
    status: UserStatusType;

    passwordConfirm?: string;
};

export type RoleType = 'admin' | 'manager' | 'employee';
export type UserStatusType = 'active' | 'disabled';
