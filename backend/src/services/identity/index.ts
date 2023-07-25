import passport from "passport";
import express from "express";
import { LOGGER } from "services/loggers";
import {
  removeUnauthorizedUsers,
  setupAllowedUsers,
} from "services/identity/authorization";
import { setupPassportAuthentication } from "services/identity/authentication";
import { IDtoUser, DtoUser } from "models/mongo/users";
import { setupPassportRegistration } from "services/identity/registration";

export const setupPassport = (app: express.Application) => {
  app.use(passport.session());
  setupAuthorization();
  setupAuthentication();
  setupRegistration();
};

const setupAuthorization = () => {
  LOGGER.info("Setup authorization for passport OIDC");
  setupAllowedUsers();
  removeUnauthorizedUsers();
};

const setupAuthentication = () => {
  LOGGER.info("Setup authentication with passport OIDC");
  setupPassportAuthentication();
};

const setupRegistration = () => {
  LOGGER.info("Setup registration with passport OIDC");
  setupPassportRegistration();
};

export const serializeUser = (
  user: Express.User,
  done: (err: any, id?: unknown) => void,
) => {
  LOGGER.info(`Serialize user with id ${(user as IDtoUser).sub}`);
  done(null, (user as IDtoUser).sub);
};

export const deserializeUser = (
  id: string,
  done: (err: any, user?: false | Express.User | null | undefined) => void,
) => {
  LOGGER.info(`Deserialize User with id ${id}`);
  DtoUser.findOne({ sub: id })
    .then((user) => done(null, user))
    .catch((err) => done(err, null));
};
