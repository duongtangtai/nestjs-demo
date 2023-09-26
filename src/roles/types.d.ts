type CreateRoleParams = {
    name: string;
    description: string;
}

type UpdateRoleParams = {
    id: UUID;
    name: string;
    description: string;
}