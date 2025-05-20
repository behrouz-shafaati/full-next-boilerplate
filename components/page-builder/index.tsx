'use client'
import dynamic from 'next/dynamic'

const Builder = dynamic(() => import('./components/Builder'), {
  ssr: false, // مهم: جلوگیری از رندر سمت سرور
})

export default function PageBuilder() {
  return <Builder />
}
