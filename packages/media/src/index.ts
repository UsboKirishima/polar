import type { MediaType } from '@polar/types/general'
import type { Express } from 'express'

import { avatarService, bannerService } from '@polar/services'
import ImageKit from 'imagekit'

/* ImageKit CDN */
export const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
})

export async function uploadMedia(
  type: MediaType,
  file: Express.Multer.File,
  userId: string,
) {
  const { url } = await imageKit.upload({
    file: file.buffer,
    fileName: `user-${userId}.png`,
    folder: `/${type}`,
  })

  const service
        = type === 'avatars'
          ? avatarService.uploadAvatar
          : bannerService.uploadBanner

  return service(userId, url)
}
