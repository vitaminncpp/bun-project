export class User {
  public id?: string;
  public username: string;
  public name: string;
  public password?: string;
  public createdAt: Date | null;
  public updatedAt: Date | null;
  public metaInfo?: any;
  constructor() {
    this.username = "";
    this.name = "";
    this.createdAt = null;
    this.updatedAt = null;
    this.metaInfo = undefined;
  }

  static from(
    userObj: {
      id?: string;
      username: string;
      name: string;
      password?: string;
      createdAt?: Date | null;
      updatedAt?: Date | null;
      metaInfo?: any;
    },
    password?: boolean
  ): User {
    const user = new User();
    user.id = userObj.id;
    user.username = userObj.username;
    user.name = userObj.name;
    user.password = password ? userObj.password : undefined;
    user.createdAt = userObj.createdAt ?? null;
    user.updatedAt = userObj.updatedAt ?? null;
    user.metaInfo = userObj.metaInfo;
    return user;
  }
  getCopy(): User {
    return User.from({
      id: this.id,
      username: this.username,
      name: this.name,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      metaInfo: this.metaInfo,
    });
  }
}
