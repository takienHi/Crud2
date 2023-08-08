export type RoleType = {
    label: string;
    value: string;
};

export const getRoles = (role: string) => {
    let roles: RoleType[] = [];
    if (role === 'admin') {
        roles = [{ label: 'Manager', value: 'manager' }, { label: 'Employee', value: 'employee' }, ...roles];
    } else if (role === 'manager') {
        roles = [{ label: 'Employee', value: 'employee' }, ...roles];
    }
    return roles;
};
