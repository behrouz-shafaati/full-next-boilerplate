type VideoEmbedRendererProps = {
  attribs: {
    src: string
    title: string
  }
}
export default function VideoEmbedRenderer({
  attribs,
  ...resProps
}: VideoEmbedRendererProps) {
  const { className } = resProps
  return (
    <div
      style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}
      className={`rounded-xl shadow-md overflow-hidden my-4 ${className}`}
    >
      <iframe
        src={attribs.src}
        title={attribs.title || 'Embedded Video'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 0,
        }}
        allowFullScreen
        loading="lazy"
      />
    </div>
  )
}
