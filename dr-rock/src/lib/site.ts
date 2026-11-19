/**
 * Public, non-secret site configuration.
 * Everything here may be read by client components.
 */
export const siteConfig = {
  name: "Dr.Rock",
  slogan: "Every rock has a story. Discover yours.",
  description:
    "Dr.Rock is an AI-powered geology lab in your pocket: photograph a rock to identify it, look for possible fossils and explore its geological history.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"),
  /** Optional public contact address shown on the landing page footer. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  appPath: "/app",
  /** Android app (Capacitor shell that opens this site), built from ../dr-rock-mobile. */
  androidApk: {
    href: "/downloads/Dr.Rock.apk",
    version: "1.0",
    size: "3.9 MB",
    minAndroid: "7.0",
  },
} as const;

