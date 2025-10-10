import type { Express } from "express";
import { imageKit } from "..";
import * as bannerService from "../services/banner.service";
import * as avatarService from "../services/avatar.service";

type MediaType = "avatars" | "banners";

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
