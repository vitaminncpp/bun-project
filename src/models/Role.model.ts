export class Role {
  public id: string;
  public rolename: string;
  public description?: string;
  public createdAt: Date | null;
  public updatedAt: Date | null;

  constructor() {
    this.id = "";
    this.rolename = "";
    this.description = "";
    this.createdAt = null;
    this.updatedAt = null;
  }

  static from(
    roleObj: {
      id: string;
      rolename: string;
      description?: string;
      createdAt?: Date | null;
      updatedAt?: Date | null;
    },
    genrateId?: boolean
  ): Role {
    const role = new Role();
    role.id = roleObj.id;
    role.rolename = roleObj.rolename;
    role.description = roleObj.description;
    role.createdAt = roleObj.createdAt ?? null;
    role.updatedAt = roleObj.updatedAt ?? null;
    return role;
  }
  getCopy(): Role {
    return Role.from({
      id: this.id,
      rolename: this.rolename,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
