import { Schema, model, Document } from "mongoose";

export interface IDtoUserSettings extends Document {
  country: string;
  city: string;
  zip_code: string;
  sub: string;
}

const UserSettingsSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },

    sub: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: false,
    },
    zip_code: {
      type: String,
      required: false,
    },
  },
  { strict: false }
);

export const DtoUserSettings = model("userSettings", UserSettingsSchema);
