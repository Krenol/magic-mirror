import { Schema, model } from "mongoose"
import { URL } from "url"

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
            type: URL
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

export const DbUser = model("users", UserSchema);