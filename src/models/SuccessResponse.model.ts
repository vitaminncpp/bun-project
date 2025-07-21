export default class SuccessResponse {
  private isSuccessFull = true as const;
  status: number;
  success: string;
  data: any;

  constructor(status: number, success: string, data: any) {
    this.status = status;
    this.success = success;
    this.data = data;
  }
}
