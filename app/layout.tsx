import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap', // Optimize font loading
});

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Vidit Agrawal | Full Stack Developer",
  description: "Experienced full-stack developer specializing in React, Node.js, and modern web technologies. Available for hire for your next project.",
  keywords: [
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'JavaScript',
    'TypeScript',
    'Web Development',
    'Mobile Development',
    'Portfolio',
  ],
  authors: [{ name: 'Vidit Agrawal' }],
  creator: 'Vidit Agrawal',
  
  // Open Graph for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Vidit Agrawal | Full Stack Developer',
    description: 'Experienced full-stack developer available for hire',
    siteName: 'Vidit Agrawal Portfolio',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Vidit Agrawal | Full Stack Developer',
    description: 'Experienced full-stack developer available for hire',
  },
  
  // Mobile app configurations
  manifest: '/manifest.json',
  
  // Robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Safari specific */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Vidit Portfolio" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#0a0a0a" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body className={`${jetbrainsMono.variable} ${inter.variable} font-mono antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
