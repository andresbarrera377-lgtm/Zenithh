import { describe, expect, it } from "vitest";
import { detectInstallPlatform } from "./platform";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 26_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1";
const IPAD = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Safari/605.1.15";
const ANDROID = "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36";
const APK = `${ANDROID} DrRockAndroid/1.0`;
const WINDOWS = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36";

describe("detectInstallPlatform", () => {
  it("recognises each install path", () => {
    expect(detectInstallPlatform(IPHONE, { standalone: false, maxTouchPoints: 5 })).toBe("ios");
    expect(detectInstallPlatform(IPAD, { standalone: false, maxTouchPoints: 5 })).toBe("ios");
    expect(detectInstallPlatform(IPAD, { standalone: false, maxTouchPoints: 0 })).toBe("other"); // a real Mac
    expect(detectInstallPlatform(ANDROID, { standalone: false, maxTouchPoints: 5 })).toBe("android");
    expect(detectInstallPlatform(WINDOWS, { standalone: false, maxTouchPoints: 0 })).toBe("other");
  });

  it("treats the home-screen app and the Android APK as installed", () => {
    expect(detectInstallPlatform(IPHONE, { standalone: true, maxTouchPoints: 5 })).toBe("installed");
    expect(detectInstallPlatform(APK, { standalone: false, maxTouchPoints: 5 })).toBe("installed");
  });
});
