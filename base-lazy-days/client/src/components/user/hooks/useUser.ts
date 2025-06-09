import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

import type { User } from '@shared/types';

import { useLoginData } from '@/auth/AuthContext';
import { axiosInstance, getJWTHeader } from '@/axiosInstance';
import { queryKeys } from '@/react-query/constants';
import { generateUserKey } from '@/react-query/key-factories';

// query function
async function getUser(userId: number, userToken: string) {
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    `/user/${userId}`,
    {
      headers: getJWTHeader(userToken),
    }
  );

  return data.user;
}

export function useUser() {
  const queryClient = useQueryClient();

  // get details on the userId
  const { userId, userToken } = useLoginData();

  const { data: user } = useQuery({
    enabled: !!userId,
    queryKey: generateUserKey(userId),
    queryFn: () => getUser(userId, userToken),
    staleTime: Infinity, // never stale
  });

  // meant to be called from useAuth
  function updateUser(newUser: User): void {
    // update user in query cache
    queryClient.setQueryData(generateUserKey(newUser.id), newUser);
  }

  // meant to be called from useAuth
  function clearUser() {
    // remove user from query cache
    queryClient.removeQueries({
      queryKey: [queryKeys.user],
    });

    // remove user appointments from query cache
    queryClient.removeQueries({
      queryKey: [queryKeys.appointments, queryKeys.user],
    });
  }

  return { user, updateUser, clearUser };
}
