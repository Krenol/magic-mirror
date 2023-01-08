export type AccessTokenInfo = {
    access_type: string,
    aud: string,
    azp: string,
    email: string,
    email_verified: string,
    exp: number,
    expires_in: number,
    scope: string,
    sub: number | string
}