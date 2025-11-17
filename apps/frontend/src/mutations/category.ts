import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

const queryClient = useQueryClient();
const categoryKeys = Object.keys(trpc.category) as Array<keyof typeof trpc.category>;

export const categoryMutations: {
    [K in keyof typeof trpc.category]: () => ReturnType<typeof useMutation<inferProcedureOutput<AppRouter['category'][K]>, unknown, inferProcedureInput<AppRouter['category'][K]>>>
} = categoryKeys.reduce((acc, key) => {
    acc[key] = () =>
        useMutation<inferProcedureOutput<AppRouter['category'][typeof key]>, unknown, inferProcedureInput<AppRouter['category'][typeof key]>>(
            {
                mutationFn: (input) => (trpc.category[key] as any).mutation(input),
                onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getAll', 'getReceivedRequests', 'getSentRequests'] }),
            }
        );
    return acc;
}, {} as any);