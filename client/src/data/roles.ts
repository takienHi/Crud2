export type RoleType = {
    label: string;
    value: string;
};

export const getRoles = (role: string) => {
    let roles: RoleType[] = [];
    if (role === 'admin') {
        roles = [
            { label: 'Manager', value: 'manager' },
            { label: 'Employee', value: 'employee' }
        ];
    } else if (role === 'employee') {
        roles = [{ label: 'Employee', value: 'employee' }];
    }
    return roles;
};
