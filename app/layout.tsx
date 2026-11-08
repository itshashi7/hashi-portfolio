import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { profile, SITE_URL } from "@/lib/profile";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const title = `${profile.person.name} — ${profile.person.title}`;
const description =
  "Backend engineer building Java and Spring Boot microservices, event-driven RabbitMQ integrations and Redis-backed APIs across AWS, Azure and GCP at Tata Communications. Open to remote roles and relocation to the UAE or Saudi Arabia.";

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title,
  description,
  applicationName: "Hashim Khan N",
  authors: [{ name: profile.person.name, url: profile.links.github }],
  keywords: ["Backend Engineer", "Java", "Spring Boot", "Microservices", "RabbitMQ", "Redis", "PostgreSQL", "AWS", "Azure", "GCP", "Dubai", "Saudi Arabia", "Remote"],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/`,
    title,
    description,
    siteName: "Hashim Khan N",
    locale: "en_US",
    firstName: "Hashim",
    lastName: "Khan N",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "Hashim Khan N — Software Engineer, Backend" }],
  },
  twitter: { card: "summary_large_image", title, description, images: [`${SITE_URL}/og.png`] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0f" },
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
  ],
  colorScheme: "dark light",
};

// Marks repeat visits before first paint so the loader never flashes (sessionStorage in try/catch).
const loaderScript = `try{if(sessionStorage.getItem('hk:loaded'))document.documentElement.dataset.loaded='1'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loaderScript }} />
        <style>{`html[data-loaded] #site-loader{display:none}@media (prefers-reduced-motion: reduce){#site-loader{display:none}}`}</style>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
