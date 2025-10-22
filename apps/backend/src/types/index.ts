import { z } from "zod";
import type { Express } from "express";

export const fileSchema = z.custom<Express.Multer.File>(
    (val) => val && typeof val === "object" && "buffer" in val && "mimetype" in val,
    { message: "Invalid file upload" }
);
