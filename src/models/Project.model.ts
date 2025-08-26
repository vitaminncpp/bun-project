export class Project {
  id!: string;
  name!: string;
  description?: string | null;
  userId!: string;

  constructor() {}

  static from(proj: {
    id: string;
    name: string;
    description?: string | null;
    userId: string;
  }): Project {
    const project = new Project();

    project.id = proj.id;
    project.name = proj.name;
    project.description = proj.description;
    project.userId = proj.userId;

    return project;
  }
  getCopy(): Project {
    return Project.from({
      id: this.id,
      name: this.name,
      description: this.description,
      userId: this.userId,
    });
  }
}
