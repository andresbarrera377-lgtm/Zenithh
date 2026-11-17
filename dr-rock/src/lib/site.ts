/**
 * Public, non-secret site configuration.
 * Everything here may be read by client components.
 */
export const siteConfig = {
  name: "Dr.Rock",
  slogan: "Every rock has a story. Discover yours.",
  description:
    "Dr.Rock is an AI-powered geology lab in your pocket: photograph a rock to identify it, look for possible fossils and explore its geological history.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /** Optional public contact address shown on the landing page footer. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  appPath: "/app",
} as const;

export const SCIENTIFIC_DISCLAIMER =
  "Photo-based identification is an educational estimate. It does not replace examination by a professional geologist or paleontologist, laboratory testing or radiometric dating.";
