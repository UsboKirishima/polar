import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

export function useUserMutations() {
    const queryClient = useQueryClient();
    const userKeys = Object.keys(trpc.user) as Array<keyof typeof trpc.user>;

    const userMutations: {
        [K in keyof typeof trpc.user]: () => ReturnType<typeof useMutation<inferProcedureOutput<AppRouter['user'][K]>, unknown, inferProcedureInput<AppRouter['user'][K]>>>
    } = userKeys.reduce((acc, key) => {
        acc[key] = () =>
            useMutation<inferProcedureOutput<AppRouter['user'][typeof key]>, unknown, inferProcedureInput<AppRouter['user'][typeof key]>>(
                {
                    mutationFn: (input) => (trpc.user[key] as any).mutation(input),
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getMe'] }),
                }
            );
        return acc;
    }, {} as any);

    return userMutations;
}