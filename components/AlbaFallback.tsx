'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
// سیستمی سبک، آزاد، مطمئن و قدرتمند برای سفر طولانی مدیریت محتوا»
export default function AlbaFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        {/* لوگو جایگزین میشه */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            alt="ALBA CMS"
            src="./alba-white.svg"
            height={200}
            width={200}
            className="mx-auto "
          />
        </motion.div>

        {/* عنوان اصلی */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-5xl font-bold tracking-wide sm:text-6xl"
        >
          ALBA CMS
        </motion.h1>

        {/* توضیح کوتاه */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-4 text-lg text-gray-400"
        >
          Fly Beyond Limits
          <br />
          <Link className="mt-6" href={`/dashboard`}>
            Login to admin panel
          </Link>
        </motion.p>
      </div>
    </div>
  )
}
