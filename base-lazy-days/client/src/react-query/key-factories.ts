import { queryKeys } from './constants';

export const generateUserKey = (userId: number) => {
  return [queryKeys.user, userId];
};

export const generateAppointmentsKey = (userId: number, userToken: string) => {
  return [queryKeys.appointments, queryKeys.user, userId, userToken];
};
