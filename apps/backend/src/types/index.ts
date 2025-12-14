import type { Express } from 'express'

import { z } from 'zod'

export const fileSchema = z.custom<Express.Multer.File>(
    val =>
        val && typeof val === 'object' && 'buffer' in val && 'mimetype' in val,
    { message: 'Invalid file upload' }
)
