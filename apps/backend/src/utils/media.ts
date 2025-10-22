import type { Express } from "express";
import { imageKit } from "..";
import { bannerService } from "@polar/services";
import { avatarService } from "@polar/services";
import { MediaType } from "@polar/types/general";

export const uploadMedia = async (
    type: MediaType,
    file: Express.Multer.File,
    userId: string
) => {
    const { url } = await imageKit.upload({
        file: file.buffer,
        fileName: `user-${userId}.png`,
        folder: `/${type}`,
    });

    const service =
        type === "avatars" ? avatarService.uploadAvatar : bannerService.uploadBanner;

    return service(userId, url);
};
