// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
'use client';
import dynamic from 'next/dynamic';
import { PageContent } from './types';

const Builder = dynamic(() => import('./components/Builder'), {
  ssr: false, // مهم: جلوگیری از رندر سمت سرور
});

type PageBuilderProp = {
  initialContent: PageContent;
};

export default function PageBuilder({ initialContent }: PageBuilderProp) {
  return <Builder initialContent={initialContent} />;
}
