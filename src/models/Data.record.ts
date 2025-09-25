export interface DataRecord<Data = any> {
  total: number;
  page: number;
  size: number;
  records: Array<Data>;
}
