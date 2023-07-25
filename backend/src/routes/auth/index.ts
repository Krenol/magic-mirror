import passport from "passport";
import {
  FAILURE_REDIRECT_URI,
  GOOGLE_LOGIN_CALLBACK_CONTEXT,
  GOOGLE_REGISTER_CALLBACK_CONTEXT,
  LOGIN_STRATEGY_NAME,
  REDIRECT_URI,
  REGISTER_REDIRECT_URI,
  REGISTER_STRATEGY_NAME,
  SCOPES,
} from "config";
import { checkAuthenticated } from "services/middleware/authenticated";
import { getRouter } from "services/router_factory";
import { authCheck, logout } from "routes/auth/api";

const router = getRouter(false);

router.get(
  "/auth/login",
  passport.authenticate(LOGIN_STRATEGY_NAME, <object>{
    scope: SCOPES,
    accessType: "offline",
    prompt: "consent",
  }),
);

router.get(
  GOOGLE_LOGIN_CALLBACK_CONTEXT,
  passport.authenticate(LOGIN_STRATEGY_NAME, {
    successRedirect: REDIRECT_URI,
    failureRedirect: FAILURE_REDIRECT_URI,
  }),
);

router.get(
  "/auth/register",
  passport.authenticate(REGISTER_STRATEGY_NAME, <object>{
    scope: SCOPES,
    accessType: "offline",
    prompt: "consent",
  }),
);

router.get(
  GOOGLE_REGISTER_CALLBACK_CONTEXT,
  passport.authenticate(REGISTER_STRATEGY_NAME, {
    successRedirect: REGISTER_REDIRECT_URI,
    failureRedirect: FAILURE_REDIRECT_URI,
  }),
);

router.post("/logout", checkAuthenticated, logout);

router.get("/auth/check", checkAuthenticated, authCheck);

export default router;
