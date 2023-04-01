import { ALLOWED_USERS } from "../../config/auth";
import { DtoAllowedUserEmail, IAllowedUserEmail } from "../../models/mongo/allowed_user_emails"
import { LOGGER } from "../loggers";

export const setupAllowedUsers = () => {
    LOGGER.debug(`Adding allowed user emails ${JSON.stringify(ALLOWED_USERS)}`);
    ALLOWED_USERS.forEach(email => {
        DtoAllowedUserEmail.findOne({ email })
            .then(foundEntry => handleResponse(foundEntry, email))
            .catch(err => {
                LOGGER.error(err.message);
                throw err;
            })
    });
}

const handleResponse = (foundEntry: IAllowedUserEmail | null, email: string) => {
    if (foundEntry) return;
    LOGGER.debug(`Adding allowed user email ${email}`);
    let newMail = new DtoAllowedUserEmail({
        email
    })
    return newMail.save();
}