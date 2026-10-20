import type { Metadata } from 'next';
import '../styles/brandscalers-library.css';
import '../styles/builder-ui.css';

export const metadata: Metadata = {
  title: 'Website Studio 2.0 | Engine Preview & Builder',
  description: 'Business-aware website-generation engine and component-composition pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&family=Figtree:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&family=Jost:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Work+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
