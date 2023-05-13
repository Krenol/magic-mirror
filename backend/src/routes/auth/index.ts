import passport from "passport";
import { FAILURE_REDIRECT_URI, GOOGLE_CALLBACK_CONTEXT, LOGIN_STRATEGY_NAME, REDIRECT_URI, SCOPES } from "config";
import { checkAuthenticated } from "middleware/authenticated";
import { getRouter } from "services/router_factory";
import { authCheck, logout } from "routes/auth/api";

const router = getRouter(false);

router.get('/auth/google', passport.authenticate(LOGIN_STRATEGY_NAME, <object>{
    scope: SCOPES,
    accessType: 'offline',
    prompt: 'consent',
}));

router.get(GOOGLE_CALLBACK_CONTEXT, passport.authenticate(LOGIN_STRATEGY_NAME,
    {
        successRedirect: REDIRECT_URI,
        failureRedirect: FAILURE_REDIRECT_URI
    }
));

router.post('/logout', checkAuthenticated, logout);

router.get("/auth/check", checkAuthenticated, authCheck);

export default router;