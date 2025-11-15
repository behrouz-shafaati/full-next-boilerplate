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
  const { className, ...rest } = props
  return (
    <article style={styles} className={`font-light ${className}`} {...rest}>
      {content}
    </article>
  )
}
