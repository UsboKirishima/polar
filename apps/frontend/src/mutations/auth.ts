import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { trpc } from '@/trpc';
import type { inferProcedureInput, inferProcedureOutput } from '@trpc/server';
import type { AppRouter } from '@polar/api';

export function useAuthMutations() {
    const queryClient = useQueryClient();
    
    const login = useMutation({
        mutationFn: (input: inferProcedureInput<AppRouter['auth']['login']>) => 
            trpc.auth.login.mutate(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
    });

    const register = useMutation({
        mutationFn: (input: inferProcedureInput<AppRouter['auth']['register']>) => 
            trpc.auth.register.mutate(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['me'] }),
    });

    return {
        login,
        register,
    };
}