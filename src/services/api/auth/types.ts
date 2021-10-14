interface AuthResponse {
  data: { token: string },
}

export interface AuthApi {
  signIn: () => Promise<AuthResponse>
}
