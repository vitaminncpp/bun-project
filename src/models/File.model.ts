export class FileModel {
  id!: string;
  name!: string;
  description?: string | null;
  projectId!: string;
  path!: string;
  constructor() {}
  static from(fileObj: {
    id: string;
    name: string;
    description?: string | null;
    projectId: string;
    path: string;
  }): FileModel {
    const file = new FileModel();

    file.id = fileObj.id;
    file.name = fileObj.name;
    file.description = fileObj.description;
    file.projectId = fileObj.projectId;
    file.path = fileObj.path;

    return file;
  }
  getCopy(): FileModel {
    return FileModel.from({
      id: this.id,
      name: this.name,
      description: this.description,
      projectId: this.projectId,
      path: this.path,
    });
  }
}
