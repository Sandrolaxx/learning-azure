import { ALLOWED_IMAGE_TYPES, ALLOWED_VIDEO_TYPES } from "./constants";

export function isVideoType(mimeType: string): boolean {
    return ALLOWED_VIDEO_TYPES.includes(mimeType);
}

export function isImageType(mimeType: string): boolean {
    return ALLOWED_IMAGE_TYPES.includes(mimeType);
}