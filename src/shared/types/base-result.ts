export type BaseResult<T = undefined> = {
  success: boolean,
  data?: T;
  items?: T;
}
