import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Why you feel so bad - Your feelings are right.',
  description:
    'Your feelings are right. Look at what they are reacting to. The dread, the low mood and the loneliness are a healthy human reacting to a world that is wrong for humans.',
  metadataBase: new URL('https://whyyoufeelsobad.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Your feelings are right.',
    description: 'Look at what they are reacting to.',
    type: 'website',
    siteName: 'Why you feel so bad',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
