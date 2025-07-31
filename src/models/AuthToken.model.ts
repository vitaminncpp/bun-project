import { User } from "./User.model";

export default class AuthToken {
  accessToken: string;
  refreshToken: string;
  user?: User;

  constructor(accessToken: string, refreshToken: string, user?: User) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.user = user;
  }
}
