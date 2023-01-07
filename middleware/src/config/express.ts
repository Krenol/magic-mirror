declare global {
    namespace Express {
        interface User {
            displayName: string,
            email: string,
            access_token: string,
            refresh_token: string
        }
    }
}

export { };