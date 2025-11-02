export * from './zod'
export * from './general'

// Import all exports to create a default export
import * as zodExports from './zod'
import * as generalExports from './general'

// Default export for compatibility with import syntax issues
export default {
    ...zodExports,
    ...generalExports,
}
