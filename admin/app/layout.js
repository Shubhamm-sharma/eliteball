import "./globals.css";

export const metadata = {
  title: "Insport Live Admin",
  description:
    "Control live scores, match state, and event updates from one dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
