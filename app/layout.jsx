import "./globals.css";

export const metadata = {
  title: "עץ החלטה → פעולה",
  description: "כלי אבחון וביצוע מבוסס מדע התנהגותי",
};

export default function RootLayout({ children }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
