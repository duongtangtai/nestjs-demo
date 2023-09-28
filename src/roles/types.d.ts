type CreateRoleParams = {
    name: string;
    description: string;
    permissionNames: string[];
}

type UpdateRoleParams = {
    id: UUID;
    name: string;
    description: string;
    permissionNames: string[];
}

type AddRolePermissionsParams = {
    roleId: UUID;
    permissionNames: string[];
}