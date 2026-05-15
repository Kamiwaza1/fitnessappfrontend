import { Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fitness App",
  description: "Stay hard and lift heavy.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet"/>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body
        className={`${lexend.variable} font-display antialiased bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-100 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
