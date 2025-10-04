import "./globals.css";

export const metadata = {
  title: "Chou-AI Chat",
  description: "A helpful chatbot with sidebar features",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="night">
      <body className="h-screen w-screen">{children}</body>
    </html>
  );
}
