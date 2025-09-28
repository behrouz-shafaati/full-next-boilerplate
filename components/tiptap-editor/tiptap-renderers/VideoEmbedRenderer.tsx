export default function VideoEmbedRenderer({ node }) {
  return (
    <div
      style={{ position: 'relative', paddingTop: '56.25%' /* 16:9 */ }}
      className="rounded-xl shadow-md overflow-hidden my-4"
    >
      <iframe
        src={node.attribs.src}
        title={node.attribs.title || 'Embedded Video'}
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
