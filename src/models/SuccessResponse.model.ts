export default class SuccessResponse<Data = any> {
  private isSuccessful = true as const;
  status: number;
  success: string;
  data: Data;

  constructor(status: number, success: string, data: Data) {
    this.status = status;
    this.success = success;
    this.data = data;
  }
}
