import { trpc } from '@/trpc';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

export function usePostMutations() {
    const queryClient = useQueryClient();
    const postKeys = Object.keys(trpc.post) as Array<keyof typeof trpc.post>;

    const postMutations: {
        [K in keyof typeof trpc.post]: () => ReturnType<typeof useMutation<inferProcedureOutput<AppRouter['post'][K]>, unknown, inferProcedureInput<AppRouter['post'][K]>>>
    } = postKeys.reduce((acc, key) => {
        acc[key] = () =>
            useMutation<inferProcedureOutput<AppRouter['post'][typeof key]>, unknown, inferProcedureInput<AppRouter['post'][typeof key]>>(
                {
                    mutationFn: (input) => (trpc.post[key] as any).mutation(input),
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['getFeed', 'getAll'] }),
                }
            );
        return acc;
    }, {} as any);

    return postMutations;
}