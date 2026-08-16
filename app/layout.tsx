import type { Metadata } from "next";
import { APP_VERSION } from "@/lib/regles";

export const metadata: Metadata = {
  title: `Cockpit — Ma journée · v${APP_VERSION}`,
  description: "App tâches personnelle Manu × Claude",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#0e1116",
          color: "#e6e8eb",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
