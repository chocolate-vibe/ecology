export interface AuthResponse {
  data: { token: string },
}

export interface AuthApi {
  signIn: ({ login, password }: { login: string, password: string }) => Promise<AuthResponse>
}
