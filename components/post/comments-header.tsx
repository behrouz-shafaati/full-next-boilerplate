'use client'

import { MessageCircle } from 'lucide-react'
// import { motion } from 'framer-motion'

export const CommentsHeader = () => {
  return (
    <div className="relative z-10 px-6 py-8">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="p-3 bg-primary/20 rounded-full text-primary">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h2 className=" font-bold text-black dark:text-white tracking-wide">
          دیدگاه شما چیه؟
        </h2>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        نظرت برامون خیلی ارزشمنده! تجربه یا دیدگاهت رو درباره این مطلب بنویس 🌱
      </p>
    </div>
  )
  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 40 }}
  //     whileInView={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.5 }}
  //     viewport={{ once: true }}
  //     className="relative w-full flex flex-col items-center justify-center text-center my-12"
  //   >
  //     {/* پس‌زمینه شیشه‌ای با نور */}
  //     {/* <div className="absolute inset-0 rounded-3xl bg-black/10 dark:bg-white/10 backdrop-blur-lg border border-black/20 dark:border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]" /> */}

  //     {/* محتوا */}
  //     <div className="relative z-10 px-6 py-8">
  //       <div className="flex items-center justify-center gap-3 mb-3">
  //         <div className="p-3 bg-primary/20 rounded-full text-primary">
  //           <MessageCircle className="w-7 h-7" />
  //         </div>
  //         <h2 className=" font-bold text-black dark:text-white tracking-wide">
  //           دیدگاه شما چیه؟
  //         </h2>
  //       </div>

  //       <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
  //         نظرت برامون خیلی ارزشمنده! تجربه یا دیدگاهت رو درباره این مطلب بنویس
  //         🌱
  //       </p>
  //     </div>

  //     {/* سایه گرادیانی از پایین برای جذابیت */}
  //     {/* <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary/20 to-transparent rounded-b-3xl" /> */}
  //   </motion.div>
  // )
}
