import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeFunCore Docs",
  description: "CodeFunCore 文档站点",
  lang: 'zh-CN',
  
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: [
      {
        text: '指南',
        items: [
          { text: '介绍', link: '/guide/' },
          { text: '快速开始', link: '/guide/getting-started' }
        ]
      },
      {
        text: 'API 参考',
        items: [
          { text: 'API 概览', link: '/api/' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EaseCation/codefuncore-docs' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present'
    }
  },

  // 配置 base 路径用于 GitHub Pages
  base: '/codefuncore-docs/'
})
