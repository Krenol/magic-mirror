import { IncomingHttpHeaders } from 'http2';
import { getAccessToken } from './headers';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const getOAuth2ClientForUser = async (headers: IncomingHttpHeaders): Promise<OAuth2Client> => {
  const access_token = await getAccessToken(headers);
  const client = new google.auth.OAuth2();
  client.setCredentials({ access_token });
  return client;
};

export { getOAuth2ClientForUser };
