import type {Metadata} from 'next';
import type {ReactNode} from 'react';
import './globals.css';
import './App.css';

export const metadata: Metadata = {
    title: 'FitHub Tariffs',
    description: 'Тестовое задание с выбором тарифов',
};

interface RootLayoutProps {
    children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
    return (
        <html lang="ru">
        <body className={"min-h-screen bg-[#232829]"}>{children}</body>
        </html>
    );
}
