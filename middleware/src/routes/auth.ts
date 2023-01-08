import { Router } from "express";
import passport from "passport";
import { FAILURE_REDIRECT_URI, REDIRECT_URI } from "../config/auth";
import { SCOPES } from "../config/google";
import { authCheck, logout } from "../controllers/auth";
import { checkAuthenticated } from "../middleware/authenticated";

const router = Router();

router.get('/auth/google', passport.authenticate('google', <object>{
    scope: SCOPES,
    accessType: 'offline',
    prompt: 'consent',
}));

router.get('/auth/callback', passport.authenticate('google',
    { successRedirect: REDIRECT_URI, failureRedirect: FAILURE_REDIRECT_URI }
));

router.post('/logout', checkAuthenticated, logout);

router.get("/auth/check", checkAuthenticated, authCheck)

export default router;