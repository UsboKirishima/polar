export * from './context'
export * from './router'
export * from './trpc'
export * from './routers'
export type { AppRouter } from './router'

// Import all exports to create a default export
import * as contextExports from './context'
import * as routerExports from './router'
import * as trpcExports from './trpc'
import * as routersExports from './routers'

// Default export for compatibility with import syntax issues
export default {
    ...contextExports,
    ...routerExports,
    ...trpcExports,
    ...routersExports,
}
