"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { getMe, login as loginFn, logout as logoutFn, signup as signupFn } from '@/lib/api';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: getMe,
    retry: false,
    // Revalidate in the background so role/profile changes (e.g. after
    // onboarding) propagate without a hard reload.
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginFn,
    onSuccess: (user) => {
      queryClient.setQueryData(['user'], user);
      router.push('/dashboard');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutFn,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null);
      router.push('/auth/login');
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: signupFn,
  });
}
