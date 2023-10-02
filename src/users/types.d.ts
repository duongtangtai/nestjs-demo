type CreateUserParams = {
    username: string;
    password: string;
    email: string;
}

type UpdateUserParams = {
    username: string;
    password: string;
    email: string;
}

type AddUserRolesParams = {
    userId: UUID,
    roleNames: string[],
}

type EventChangePasswordDto = {
    username: string,
    email: string,
    password: string,
}