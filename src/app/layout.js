import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar/page";
import { UserProvider } from "@/contexts/UserContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Prima Bookstore",
  description: "Place where you can buy best selling books",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <NavBar />
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
