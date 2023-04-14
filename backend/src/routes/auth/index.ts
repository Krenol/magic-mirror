import passport from "passport";
import { FAILURE_REDIRECT_URI, GOOGLE_CALLBACK_CONTEXT, REDIRECT_URI } from "config/auth";
import { SCOPES } from "config/google";
import { checkAuthenticated } from "middleware/authenticated";
import { getRouter } from "services/router_factory";
import { authCheck, logout } from "routes/auth/api";

const router = getRouter(false);

router.get('/auth/google', passport.authenticate('google-login', <object>{
    scope: SCOPES,
    accessType: 'offline',
    prompt: 'consent',
}));

router.get(GOOGLE_CALLBACK_CONTEXT, passport.authenticate('google-login',
    { successRedirect: REDIRECT_URI, failureRedirect: FAILURE_REDIRECT_URI }
));

router.post('/logout', checkAuthenticated, logout);

router.get("/auth/check", checkAuthenticated, authCheck)

export default router;