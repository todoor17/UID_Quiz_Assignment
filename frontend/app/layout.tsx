import type { Metadata } from "next";
import "../index.css";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Quiz Management Platform",
  description: "A platform for managing quizzes, classes, and students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
