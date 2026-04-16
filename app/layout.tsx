import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Outlynk — Connect. Share. Heal.",
  description:
    "Outlynk connects patients, doctors, and diagnostic centres. Get your reports shared instantly with your doctor — no more multiple trips.",
  keywords:
    "diagnostic reports, doctor consultation, radiology, India healthcare, telemedicine, lab reports",
  openGraph: {
    title: "Outlynk — Connect. Share. Heal.",
    description:
      "Skip the extra trip. Your diagnostic reports go directly to your doctor the moment they are ready.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
