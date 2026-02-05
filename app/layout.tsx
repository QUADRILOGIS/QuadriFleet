import type { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
import { Geist, Geist_Mono } from "next/font/google";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import InstallPrompt from "@/components/InstallPrompt";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("MetaData");

    return {
        title: t("title"),
        description: t("description"),
        manifest: "/manifest.json",
        //themeColor: "#ffffff",
        /*viewport: {
            width: "device-width",
            initialScale: 1,
            maximumScale: 1,
        },*/
        appleWebApp: {
            capable: true,
            statusBarStyle: "default",
            title: t("title"),
        },
        icons: {
            apple: "/icons/icon-192x192.png",
        },
    };
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <head>
            <link rel="manifest" href="/manifest.json" />
        </head>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <NextIntlClientProvider>
            <PrimeReactProvider>
                <div className="flex">
                    <SideBar />
                    <main className="relative flex-1 lg:ml-0 w-full pb-20 lg:pb-0">
                        <div className="lg:hidden absolute top-4 right-4 z-40">
                            <Image src="/logo.svg" alt="Logo" width={40} height={20} />
                        </div>
                        {children}
                    </main>
                </div>
                <InstallPrompt />
            </PrimeReactProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}