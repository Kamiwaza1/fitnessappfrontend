import { Lexend } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';
import ProTypes from 'prop-types';

const lexend = Lexend({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata = {
  title: "Fitness App",
  description: "Stay hard and lift heavy.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${lexend.variable} min-h-screen bg-background font-display text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: ProTypes.node.isRequired,
};
