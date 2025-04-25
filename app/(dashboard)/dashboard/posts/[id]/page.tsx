import React from 'react'
import TiptapEditor from '@/components/tiptap-editor'

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">ویرایشگر متن</h1>
      <TiptapEditor />
    </div>
  )
}

export default Home
