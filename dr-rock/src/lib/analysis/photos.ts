/**
 * Photo roles and limits shared by the browser and the server. Several photos of the same
 * specimen (the whole piece, a close-up of the texture, another side or a scale reference) let
 * the AI check its identification against more evidence than a single picture.
 */
export const PHOTO_ROLES = ["overview", "closeup", "other"] as const;
export type PhotoRole = (typeof PHOTO_ROLES)[number];

export const MAX_PHOTOS = PHOTO_ROLES.length;

/**
 * Roles the server accepts: the user's photos plus "detail", an automatic full-resolution crop
 * of the centre of the main photo that the browser adds when there is room (see process-image.ts).
 */
export const UPLOAD_ROLES = [...PHOTO_ROLES, "detail"] as const;
export type UploadRole = (typeof UPLOAD_ROLES)[number];

export function isPhotoRole(value: unknown): value is UploadRole {
  return typeof value === "string" && (UPLOAD_ROLES as readonly string[]).includes(value);
}

/**
 * Upload budget. Claude reads images at up to 2576 px on the long edge, so photos are prepared at
 * that size. Hosts cap a request body (Vercel: 4.5 MB; Netlify: ~6 MB once base64-encoded), so all
 * photos together stay under MAX_TOTAL_PHOTO_BYTES (plus a little multipart overhead) and each one
 * under the per-image target the browser aims for.
 */
export const PHOTO_TARGET_BYTES = 1.25 * 1024 * 1024;
export const MAX_TOTAL_PHOTO_BYTES = 4 * 1024 * 1024;
