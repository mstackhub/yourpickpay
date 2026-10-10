import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourpickpay.com'),
  title: 'YOURPICKPAY - ผ่อนสินค้าแบรนด์เนมแท้ 100% รายวัน รายเดือน',
  description: 'แคตตาล็อกสินค้าแบรนด์เนมแท้ 100% พร้อมเครื่องคำนวณราคาผ่อน เลือกระยะเวลาและความถี่ได้ตามใจ อนุมัติไว ไม่เช็คบูโร',
  keywords: 'ผ่อนแบรนด์เนม, ผ่อนของแบรนด์เนมแท้, แบรนด์เนมผ่อนรายวัน, Yourpickpay',
  openGraph: {
    title: 'YOURPICKPAY - ผ่อนสินค้าแบรนด์เนมแท้ 100%',
    description: 'ผ่อนสินค้าแบรนด์เนมแท้รายวัน รายสัปดาห์ รายเดือน เริ่มต้นวันละหลักสิบบาท อนุมัติง่าย ส่งฟรีทั่วประเทศ',
    url: 'https://yourpickpay.com',
    siteName: 'Yourpickpay',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=1200&auto=format&fit=crop&q=80',
        width: 1200,
        height: 630,
        alt: 'Yourpickpay Luxury Brand-name',
      },
    ],
    locale: 'th_TH',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Thai:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-white text-[#111111] antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
