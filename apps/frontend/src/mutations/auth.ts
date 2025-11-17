import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

const queryClient = useQueryClient();
const authKeys = Object.keys(trpc.auth) as Array<keyof typeof trpc.auth>;

export const authMutations: {
    [K in keyof typeof trpc.auth]: () => ReturnType<typeof useMutation<inferProcedureOutput<AppRouter['auth'][K]>, unknown, inferProcedureInput<AppRouter['auth'][K]>>>
} = authKeys.reduce((acc, key) => {
    acc[key] = () =>
        useMutation<inferProcedureOutput<AppRouter['auth'][typeof key]>, unknown, inferProcedureInput<AppRouter['auth'][typeof key]>>(
            {
                mutationFn: (input) => (trpc.auth[key] as any).mutation(input),
                onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
            }
        );
    return acc;
}, {} as any);