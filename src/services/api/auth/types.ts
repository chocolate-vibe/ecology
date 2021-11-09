import { AxiosResponse } from 'axios';

export interface AuthResponse {
   token: string,
}

export interface SignIn { email: string, password: string }

export interface AuthApi {
  signIn: ({ email, password }: SignIn) => Promise<AxiosResponse<AuthResponse>>
}
