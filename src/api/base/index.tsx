import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

interface IStatus {
  error: boolean;
  message: string | '';
  reason: string | '';
}

export type SpecificToken = { token: string, isBasic: boolean }

const resolvePath = (object: any, path: any, defaultValue?: any) => path.split('.').reduce((o: any, p: any) => (o ? o[p] : defaultValue), object);

function defaultHeader() {
  return {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
  };
}

function defaultErrorCallback(err: Error | AxiosError) {
  throw err;
}

function defaultReturnCallback<T>(response: AxiosResponse<T>, returnProp?: string): T {
  if (returnProp) {
    const responseAsAny = response.data as any;

    if (returnProp.split('.').length > 1) {
      return resolvePath(responseAsAny, returnProp) as T;
    }

    return responseAsAny[returnProp] as T;
  }

  return response.data;
}

export class Crud {
  url: string;

  constructor(url: string) {
    this.url = url;

    this.defaultGet = this.defaultGet.bind(this);
    this.defaultPost = this.defaultPost.bind(this);
    this.defaultPatch = this.defaultPatch.bind(this);
    this.defaultPut = this.defaultPut.bind(this);
    this.defaultDelete = this.defaultDelete.bind(this);
  }

  defaultGet<T>(endpoint: string, returnProp?: string, config?: AxiosRequestConfig): Promise<T> {
    const instance = axios.create({ ...config, headers: defaultHeader() });

    return instance
      .get<T>(`${this.url}/${endpoint}`)
      .then((response) => defaultReturnCallback<T>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        // todo mapear tipo pra erro
        throw defaultErrorCallback(err);
      });
  }

  defaultPost<T, J = any>(endpoint: string, data: T, returnProp?: string): Promise<J> {
    const instance = axios.create({ headers: defaultHeader() });

    return instance
      .post<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultPatch<T, J = any>(endpoint: string, data: T, returnProp?: string): Promise<J> {
    const instance = axios.create({ headers: defaultHeader() });

    return instance
      .patch<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultPut<T, J = IStatus>(endpoint: string, data: T, returnProp?: string): Promise<J> {
    const instance = axios.create({ headers: defaultHeader() });

    return instance
      .put<J>(`${this.url}/${endpoint}`, data)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }

  defaultDelete<T, J = any>(endpoint: string, data: T, returnProp?: string): Promise<J> {
    const instance = axios.create({ headers: defaultHeader() });

    return instance
      .delete<J>(`${this.url}/${endpoint}`, data ? { data } : undefined)
      .then((response) => defaultReturnCallback<J>(response, returnProp))
      .catch((err: Error | AxiosError) => {
        throw defaultErrorCallback(err);
      });
  }
}
