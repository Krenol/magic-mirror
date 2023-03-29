import { Schema, model } from "mongoose"

const UserSchema = new Schema(
    {
        displayName: {
            type: String
        },
        given_name: {
            type: String
        },
        family_name: {
            type: String
        },
        photo: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        sub: {
            type: String,
            required: true,
            unique: true
        },
        access_token: {
            type: String,
            required: true,
        },
        refresh_token: {
            type: String,
            required: true,
        }
    },
    { strict: false }
);

export const DbUser = model("user", UserSchema);