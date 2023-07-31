import { logout } from "../apis/logout";

export class AuthenticationHandler {
  private currentRetries: number = 0;
  constructor(private readonly maxRetries = 3) {}

  public noAuth() {
    if (this.maxRetriesReached()) {
      logout();
    } else {
      this.currentRetries++;
    }
  }

  public authSuccess() {
    if (this.currentRetries !== 0) {
      this.resetRetries();
    }
  }

  private maxRetriesReached() {
    return this.currentRetries >= this.maxRetries;
  }

  private resetRetries() {
    this.currentRetries = 0;
  }
}
