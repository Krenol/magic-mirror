import passport from "passport";
import { Express } from "express";
import { LOGGER } from "services/loggers";
import { removeUnauthorizedUsers, setupAllowedUsers } from 'services/login/authorization';
import { setupPassportAuthentication } from "services/login/authentication";

export const setupPassport = (app: Express) => {
    app.use(passport.initialize());
    app.use(passport.session());
    setupAuthentication();
    setupAuthorization();
}

const setupAuthorization = () => {
    LOGGER.info("Setup authorization for passport OIDC");
    setupAllowedUsers();
    removeUnauthorizedUsers();
}

const setupAuthentication = () => {
    LOGGER.info("Setup authentication with passport OIDC");
    setupPassportAuthentication();
}
