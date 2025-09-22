import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Add startup logging
console.log(`[${new Date().toISOString()}] 🚀 Next.js Layout initializing`);
console.log(
  `[${new Date().toISOString()}] 🌍 Environment: ${
    typeof window !== "undefined" ? "Client" : "Server"
  }`
);
console.log(
  `[${new Date().toISOString()}] 📦 Node version: ${
    typeof process !== "undefined" ? process.version : "N/A"
  }`
);

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
console.log(`[${new Date().toISOString()}] ✅ Geist Sans font loaded`);

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
console.log(`[${new Date().toISOString()}] ✅ Geist Mono font loaded`);

export const metadata: Metadata = {
  title: "Next.js Azure Diagnostics",
  description:
    "Diagnostic dashboard for Azure App Service deployment troubleshooting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(
    `[${new Date().toISOString()}] 🎨 RootLayout component rendering`
  );

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('[' + new Date().toISOString() + '] 🌐 Client-side script executing in browser');
              console.log('[' + new Date().toISOString() + '] 📱 User Agent: ' + navigator.userAgent);
              console.log('[' + new Date().toISOString() + '] 🔧 Window location: ' + window.location.href);
              window.addEventListener('load', function() {
                console.log('[' + new Date().toISOString() + '] ✅ Window load event fired');
              });
              window.addEventListener('error', function(e) {
                console.error('[' + new Date().toISOString() + '] ❌ Global error:', e.error);
              });
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
