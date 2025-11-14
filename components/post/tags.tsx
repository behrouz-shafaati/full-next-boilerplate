import { getTranslation, timeAgo } from '@/lib/utils'
import React from 'react'
import { Tag } from '@/features/tag/interface'
import Link from 'next/link'
import { Button } from '../ui/button'
import { IconRenderer } from '../builder-canvas/components/IconRenderer'

type PostCoverProps = {
  tags: Tag[]
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostTags = ({ tags, styles = {}, ...props }: PostCoverProps) => {
  return (
    <div style={styles} {...props}>
      <div className="text-sm text-gray-500 mb-8 flex gap-2">
        {tags.map((t) => {
          const translation = getTranslation({ translations: t.translations })
          return (
            <Button
              variant="outline"
              size="sm"
              className="flex gap-1"
              key={t.id}
            >
              {t?.icon && t?.icon != '' && (
                <IconRenderer name={t.icon} className={`w-5 h-5`} />
              )}
              <Link href={`/archive/tags/${t.slug}`}>{translation?.title}</Link>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
