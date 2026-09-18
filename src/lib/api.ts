import { internalApi } from './auth';
import type { User, LoginCredentials, SignupCredentials } from './auth';

export async function getMe(): Promise<User> {
  const { data } = await internalApi.get('/auth/me');
  return data.user;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const { data } = await internalApi.post('/auth/login', credentials);
  if (!data.success || !data.user) throw new Error(data.message || 'Login failed');
  return data.user;
}

export async function logout(): Promise<void> {
  await internalApi.post('/auth/logout');
}

export async function signup(credentials: SignupCredentials): Promise<void> {
  const { data } = await internalApi.post('/auth/signup', credentials);
  if (!data.success) throw new Error(data.message || 'Signup failed');
}
