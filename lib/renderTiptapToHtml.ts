// lib/renderTiptapJsonToHtml.ts
const jsdom = require('jsdom')
const { JSDOM } = jsdom
import { Schema, DOMSerializer, Node as ProseNode } from 'prosemirror-model'

// 1. تعریف schema ساده بر اساس Tiptap StarterKit + image + link
const nodes = {
  doc: { content: 'block+' },

  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0],
  },

  text: {
    group: 'inline',
  },

  image: {
    inline: true,
    attrs: { src: {}, alt: { default: null }, title: { default: null } },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom: any) => ({
          src: dom.getAttribute('src'),
          alt: dom.getAttribute('alt'),
          title: dom.getAttribute('title'),
        }),
      },
    ],
    toDOM: (node) => ['img', node.attrs],
  },
  hardBreak: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM: () => ['br'],
  },
}

const marks = {
  bold: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },
  italic: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },
  link: {
    attrs: {
      href: {},
      target: { default: '_blank' },
      rel: { default: 'noopener noreferrer' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom: any) => ({
          href: dom.getAttribute('href'),
          target: dom.getAttribute('target'),
          rel: dom.getAttribute('rel'),
        }),
      },
    ],
    toDOM: (mark) => ['a', mark.attrs, 0],
  },
}

const schema = new Schema({ nodes, marks })

// 2. تابع نهایی تبدیل JSON → HTML
export function renderTiptapJsonToHtml(json: any): string {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`)
  const document = dom.window.document

  const node = ProseNode.fromJSON(schema, json)
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    node.content,
    {
      document,
    }
  )

  const container = document.createElement('div')
  container.appendChild(fragment)

  return container.innerHTML
}
