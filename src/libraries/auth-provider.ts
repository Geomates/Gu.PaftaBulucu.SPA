import { Auth0Client } from '@auth0/auth0-spa-js';
import { eventHub } from '@/libraries/event-hub';
import * as config from '../../config.json';

export default class AuthProvider {
  private auth0Client: Auth0Client;

  constructor() {
    this.auth0Client = new Auth0Client({
      client_id: config.auth.clientId,
      audience: config.auth.audience,
      domain: config.auth.domain,
      redirect_uri: window.location.origin,
      cacheLocation: 'localstorage',
    });
  }

  public async login(): Promise<void> {
    const token = await this.auth0Client.getTokenWithPopup();
    if (token) {
      eventHub.$emit('login');
    }
  }

  public async getToken(): Promise<string> {
    return await this.auth0Client.getTokenSilently();
  }

  public async isAuthenticated(): Promise<boolean> {
    return await this.auth0Client.isAuthenticated();
  }

  public async getUser(): Promise<any> {
    return await this.auth0Client.getUser();
  }

  public logout(): void {
    this.auth0Client.logout({ returnTo: window.location.origin });
  }
}
