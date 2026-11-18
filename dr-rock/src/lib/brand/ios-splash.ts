/**
 * Launch screens for Dr.Rock installed on iPhone / iPad from Safari ("Add to Home Screen").
 * iOS ignores the web manifest for this and shows a white screen unless an
 * apple-touch-startup-image matches the exact device size, so there is one per screen size.
 * Shared by scripts/generate-assets.tsx (renders the PNGs) and the root layout (metadata).
 */
export interface SplashScreen {
  /** CSS points, portrait. */
  width: number;
  height: number;
  ratio: 2 | 3;
  devices: string;
}

export const IOS_SPLASH_SCREENS: SplashScreen[] = [
  { width: 440, height: 956, ratio: 3, devices: "iPhone 16/17 Pro Max" },
  { width: 402, height: 874, ratio: 3, devices: "iPhone 16/17 Pro" },
  { width: 420, height: 912, ratio: 3, devices: "iPhone Air" },
  { width: 430, height: 932, ratio: 3, devices: "iPhone 14/15 Pro Max, 15/16 Plus" },
  { width: 393, height: 852, ratio: 3, devices: "iPhone 14/15 Pro, 15/16" },
  { width: 428, height: 926, ratio: 3, devices: "iPhone 12/13 Pro Max, 14 Plus" },
  { width: 390, height: 844, ratio: 3, devices: "iPhone 12/13/14, 12/13 Pro" },
  { width: 375, height: 812, ratio: 3, devices: "iPhone X/XS/11 Pro, 12/13 mini" },
  { width: 414, height: 896, ratio: 3, devices: "iPhone XS Max, 11 Pro Max" },
  { width: 414, height: 896, ratio: 2, devices: "iPhone XR, 11" },
  { width: 375, height: 667, ratio: 2, devices: "iPhone SE (2nd/3rd gen), 8" },
  { width: 1024, height: 1366, ratio: 2, devices: "iPad Pro 12.9/13" },
  { width: 834, height: 1194, ratio: 2, devices: "iPad Pro 11" },
  { width: 820, height: 1180, ratio: 2, devices: "iPad Air, iPad (10th gen)" },
  { width: 768, height: 1024, ratio: 2, devices: "iPad mini, older iPads" },
];

export function splashFile(s: SplashScreen): string {
  return `/splash/ios-${s.width * s.ratio}x${s.height * s.ratio}.png`;
}

export function splashMedia(s: SplashScreen): string {
  return `(device-width: ${s.width}px) and (device-height: ${s.height}px) and (-webkit-device-pixel-ratio: ${s.ratio}) and (orientation: portrait)`;
}
