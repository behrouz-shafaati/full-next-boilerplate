import React from 'react'

type PostCoverProps = {
  content: any
  styles?: any
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostContent = ({
  content,
  styles = {},
  ...props
}: PostCoverProps) => {
  return (
    <article style={styles} {...props}>
      {content}
    </article>
  )
}
