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
  // 👇 تعریف adSlot برای رندر سمت سرور
  adSlot: {
    group: 'block',
    atom: true,
    attrs: {
      slotId: { default: null },
    },
    parseDOM: [
      {
        tag: 'ad-slot',
        getAttrs: (dom: any) => ({
          slotId: dom.getAttribute('data-slot-id'),
        }),
      },
    ],
    toDOM: (node) => [
      'ad-slot',
      node.attrs.slotId ? { 'data-slot-id': node.attrs.slotId } : {},
    ],
  },
  heading: {
    content: 'inline*',
    group: 'block',
    defining: true,
    attrs: {
      level: { default: 1 }, // h1 تا h6
      dir: { default: null }, // برای راست به چپ یا چپ به راست
      textAlign: { default: null }, // برای تراز متن
    },
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) {
      const attrs: any = {}
      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign}`

      return [
        'h' + node.attrs.level,
        attrs,
        0, // محتوای inline (مثل bold, italic, text)
      ]
    },
  },

  // ---------- 📌 نودهای جدول ----------
  table: {
    content: 'tableRow+',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    parseDOM: [{ tag: 'table' }],
    toDOM: () => ['table', ['tbody', 0]],
  },

  tableRow: {
    content: '(tableCell | tableHeader)+',
    tableRole: 'row',
    parseDOM: [{ tag: 'tr' }],
    toDOM: () => ['tr', 0],
  },

  tableCell: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'td',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'td',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
      },
      0,
    ],
  },

  tableHeader: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'header_cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'th',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'th',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
      },
      0,
    ],
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
