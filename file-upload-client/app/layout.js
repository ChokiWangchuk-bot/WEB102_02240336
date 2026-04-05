import './globals.css';

export const metadata = {
  title: 'File upload — Practical 3',
  description: 'Upload files to Express backend',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
