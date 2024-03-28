import { defineConfig } from 'vitepress'
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs'

// https://vitepress.dev/reference/site-config
// https://vitepress.dev/reference/default-theme-config
export default defineConfig({
  title: "Kømpletr",
  description: "JS autocomplete library",
  themeConfig: {
    logo: {
      light: 'https://cdn.konfer.be/images/kompletr/logo-kompletr-dark.png',
      dark: 'https://cdn.konfer.be/images/kompletr/logo-kompletr-light.png'
    },
    siteTitle: false,
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide' },
      { text: 'Demo', link: 'https://demo.kompletr.konfer.be' },
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
            { text: 'Contributions', link: '/guide/contributions' },
            { text: 'Browser support', link: '/guide/browser-support' },
            { text: 'Support', link: '/guide/support' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/steve-lebleu/kompletr' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/kompletr' },
    ],

    footer: {
      message: 'Released under the GPL License.',
      copyright: 'Copyright © 2024-present Konfer'
    }
  },
  markdown: {
    config(md) {
      md.use(tabsMarkdownPlugin)
    }
  }
})
