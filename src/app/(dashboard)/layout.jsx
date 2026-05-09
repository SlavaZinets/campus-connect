import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const fraunces = Fraunces({
    variable: "--font-display",
    subsets: ["latin"],
    weight: ["400", "600"],
    display: "swap",
});

const inter = Inter({
    variable: "--font-body",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-mono",
    subsets: ["latin"],
    weight: ["400"],
    display: "swap",
});

export const metadata = {
    title: "CampusConnect",
    description: "Student event booking & management for campus.",
};

export default function DashboardLayout({ children }) {
    return (
        <html lang="en" className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
            <body>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
