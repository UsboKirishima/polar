import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

const queryClient = useQueryClient();
const friendKeys = Object.keys(trpc.friend) as Array<keyof typeof trpc.friend>;

export const friendMutations: {
    [K in keyof typeof trpc.friend]: () => ReturnType<typeof useMutation<inferProcedureOutput<AppRouter['friend'][K]>, unknown, inferProcedureInput<AppRouter['friend'][K]>>>
} = friendKeys.reduce((acc, key) => {
    acc[key] = () =>
        useMutation<inferProcedureOutput<AppRouter['friend'][typeof key]>, unknown, inferProcedureInput<AppRouter['friend'][typeof key]>>(
            {
                mutationFn: (input) => (trpc.friend[key] as any).mutation(input),
                onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getAll', 'getReceivedRequests', 'getSentRequests'] }),
            }
        );
    return acc;
}, {} as any);