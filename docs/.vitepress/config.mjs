import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CodeFunCore",
  description: "EaseCation 服务器核心文档 - 大型分布式 Minecraft 基岩版小游戏服务器后端系统",
  lang: 'zh-CN',

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '入门指南', link: '/guide/' },
      { text: '核心系统', link: '/core/' },
      { text: '游戏系统', link: '/games/bedwars/' },
      { text: '参考资料', link: '/reference/nukkit' }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '入门指南',
          items: [
            { text: '概览', link: '/guide/' },
            { text: '项目架构介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' }
          ]
        }
      ],
      '/core/': [
        {
          text: '核心系统概览',
          items: [
            { text: '系统概览', link: '/core/' }
          ]
        },
        {
          text: '架构设计',
          collapsed: false,
          items: [
            { text: 'CodeFunCore 核心', link: '/core/architecture/' },
            { text: 'ECPlayer 系统', link: '/core/architecture/ecplayer' },
            { text: 'Stage 系统', link: '/core/architecture/stage' },
            { text: 'GracefulStage 架构', link: '/core/architecture/graceful-stage' }
          ]
        },
        {
          text: '底层系统',
          collapsed: false,
          items: [
            { text: '事件系统', link: '/core/systems/event' },
            { text: '命令系统', link: '/core/systems/command' },
            { text: '分布式通信', link: '/core/systems/communication' },
            { text: '多语言系统', link: '/core/systems/i18n' },
            { text: '数据持久化', link: '/core/systems/persistence' }
          ]
        },
        {
          text: '应用模块',
          collapsed: false,
          items: [
            { text: 'ECMerchandise 数据', link: '/core/modules/merchandise' },
            { text: 'ECTask 任务', link: '/core/modules/task' },
            { text: 'Exchange 兑换', link: '/core/modules/exchange' },
            { text: 'GamePass 通行证', link: '/core/modules/gamepass' },
            { text: 'Mission 任务框架', link: '/core/modules/mission' },
            { text: 'Questions 答题', link: '/core/modules/questions' },
            { text: 'GiftMachine 礼物机', link: '/core/modules/gift-machine' },
            { text: 'StateMachine 状态机', link: '/core/modules/state-machine' },
            { text: 'Condition 表达式', link: '/core/modules/condition' },
            { text: 'NPC 配置', link: '/core/modules/npc' },
            { text: 'HowToDo 快捷打开', link: '/core/modules/howto' }
          ]
        }
      ],
      '/games/': [
        {
          text: '游戏系统',
          items: [
            { text: 'VIP 系统', link: '/games/vip' }
          ]
        },
        {
          text: '起床战争',
          collapsed: false,
          items: [
            { text: '起床战争概览', link: '/games/bedwars/' },
            { text: '核心系统', link: '/games/bedwars/core-systems' },
            { text: '自定义规则', link: '/games/bedwars/custom-rules' },
            { text: '守护者系统', link: '/games/bedwars/guardian' },
            { text: '商店系统', link: '/games/bedwars/shop' },
            { text: '工具模块', link: '/games/bedwars/tool' }
          ]
        }
      ],
      '/reference/': [
        {
          text: '参考资料',
          items: [
            { text: 'Nukkit 开发', link: '/reference/nukkit' }
          ]
        }
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/EaseCation/CodeFunCore' }
    ],

    footer: {
      message: 'EaseCation 服务器后端系统',
      copyright: 'Copyright © 2018-2025 EaseCation'
    },

    // 搜索配置
    search: {
      provider: 'local',
      options: {
        locales: {
          'zh-CN': {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换'
                }
              }
            }
          }
        }
      }
    },

    // 文档页脚配置
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    // 大纲配置
    outline: {
      level: [2, 3],
      label: '页面导航'
    },

    // 最后更新时间文本
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium'
      }
    }
  },

  // 配置 base 路径用于 GitHub Pages
  base: '/',

  // 启用 cleanUrls 以支持伪静态路由
  cleanUrls: true,

  // Markdown 配置
  markdown: {
    lineNumbers: true
  }
})
