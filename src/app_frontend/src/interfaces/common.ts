export interface GeneralResponse {
  Ok: any;
  Err: any;
}

export interface AddressData {
  address: string;
  message: string;
  signature: string;
}

export enum RemoteDataType {
  NONE = 'NONE',
  LOADING = 'LOADING',
  LOADING_NEXT_PAGE = 'LOADING_NEXT_PAGE',
  ERROR = 'ERROR',
  ERROR_NEXT_PAGE = 'ERROR_NEXT_PAGE',
  EMPTY = 'EMPTY',
  SUCCESS = 'SUCCESS',
}

export type RemoteData<D> =
  | { type: RemoteDataType.NONE }
  | { type: RemoteDataType.LOADING }
  | { type: RemoteDataType.ERROR }
  | { type: RemoteDataType.EMPTY }
  | { type: RemoteDataType.SUCCESS; data: D };

export type Filters = {
  is_active: boolean[];
  chain_ids: string[];
  owner: string[];
  search: string[];
  method_type: { [key: string]: string }[];
};

export type Pagination = [
  {
    page: number;
    size: number;
  },
];
