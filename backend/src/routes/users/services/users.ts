import { DtoUser } from "models/mongo/users";

export const deleteUserFromDb = async (sub: string) => {
    return DtoUser.deleteOne({ sub });
}