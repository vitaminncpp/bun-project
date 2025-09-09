export class Project {
  id?: string;
  name!: string;
  description?: string | null;
  userId!: string;
  icon?: string | null;

  constructor() {}

  static from(proj: {
    id?: string;
    name: string;
    description?: string | null;
    userId: string;
    icon?: string | null;
  }): Project {
    const project = new Project();

    project.id = proj.id;
    project.name = proj.name;
    project.description = proj.description;
    project.userId = proj.userId;
    project.icon = proj.icon;

    return project;
  }
  getCopy(): Project {
    return Project.from({
      id: this.id,
      name: this.name,
      description: this.description,
      userId: this.userId,
      icon: this.icon,
    });
  }
}
