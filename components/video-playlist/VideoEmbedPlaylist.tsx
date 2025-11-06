'use client'

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlayCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'
import VideoEmbed from '../video-embed/VideoEmbed'

type VideoItem = {
  id: string
  title: string
  thumbnail: string
  src: string
  duration?: string
}

type VideoPlaylistProps = {
  videos: VideoItem[]
}

export default function VideoEmbedPlaylist({ videos }: VideoPlaylistProps) {
  const [current, setCurrent] = useState(videos[0])

  return (
    <div className="flex flex-col md:flex-row-reverse gap-4 w-full my-4">
      {/* Video Player */}
      <div className="w-full md:w-2/3">
        <VideoEmbed src={current.src} title={current.title} />
      </div>

      {/* Playlist */}
      <div className="w-full  md:w-1/3 border rounded-xl overflow-hidden">
        <div className="h-[50vh] md:h-full">
          <ScrollArea
            className=""
            style={{ position: 'relative', height: '100%' }}
          >
            <div className="divide-y divide-border">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => setCurrent(video)}
                  className={clsx(
                    'flex items-center gap-3 p-3 w-full text-right transition-all hover:bg-muted/40',
                    current.id === video.id && 'bg-muted'
                  )}
                >
                  <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="text-sm font-medium line-clamp-1">
                      {video.title}
                    </span>
                    {video.duration && (
                      <span className="text-xs text-muted-foreground">
                        {video.duration}
                      </span>
                    )}
                  </div>
                  {current.id === video.id ? (
                    <CheckCircle className="text-primary w-4 h-4 flex-shrink-0" />
                  ) : (
                    <PlayCircle className="text-muted-foreground w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
