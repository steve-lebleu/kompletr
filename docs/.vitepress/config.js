import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Kømpletr",
  description: "A vanilla JS autocomplete library",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/api' },
      { text: 'Demo', link: '/' },
    ],

    sidebar: {
      '/guide': [
        {
          text: 'Getting started',
          collapsed: false,
          items: [
            { text: 'Installation', link: '/guide/getting-started#installation' },
            { text: 'Usage', link: '/guide/getting-started#usage' }
          ]
        },
        {
          text: 'Examples',
          collapsed: false,
          items: [
            { text: 'Input', link: '/guide/examples/input' },
            { text: 'Data', link: '/guide/examples/data' },
            { text: 'Options', link: '/guide/examples/options' },
            { text: 'Callbacks', link: '/guide/examples/callbacks' },
          ]
        },
        {
          text: 'References',
          collapsed: false,
          items: [
            { text: 'Release notes', link: '/guide/release-notes' },
            { text: 'Contributions', link: '/guide/contributions' },
            { text: 'Browser support', link: '/guide/browser-support' },
            { text: 'Support', link: '/guide/support' },
          ]
        },
      ],
      '/api': {
        text: 'kompletr',
        collapsed: false,
        items: [
          { text: 'kompletr', link: '/api/signature' },
          { text: 'input', link: '/api/input' },
          { text: 'data', link: '/api/data' },
          { text: 'options', link: '/api/options' },
          { text: 'onKeyup', link: '/api/onkeyup' },
          { text: 'onSelect', link: '/api/onselect' },
          { text: 'onError', link: '/api/onerror' },
        ]
      },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/steve-lebleu/kompletr' },
      { icon: 'npm', link: 'https://github.com/steve-lebleu/kompletr' },
      { icon: 'slack', link: 'https://github.com/steve-lebleu/kompletr' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
