module.exports = {
  lang: 'en-US',
  title: 'Lando',
  description: 'Lando is the best local development environment option for Lagoon, the fastest way to build modern web apps.',
  base: '/lagoon/',
  head: [
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1'}],
    ['link', {rel: 'icon', href: '/lagoon/favicon.ico', size: 'any'}],
    ['link', {rel: 'icon', href: '/lagoon/favicon.svg', type: 'image/svg+xml'}],
    ['link', {rel: 'preconnect', href: '//fonts.googleapis.com'}],
    ['link', {rel: 'preconnect', href: '//fonts.gstatic.com', crossorigin: true}],
    ['link', {rel: 'stylesheet', href: '//fonts.googleapis.com/css2?family=Lexend:wght@500&display=swap'}],
  ],
  theme: '@lando/vuepress-theme-default-plus',
  themeConfig: {
    landoDocs: true,
    logo: '/images/icon.svg',
    docsDir: 'docs',
    docsBranch: 'main',
    repo: 'lando/lagoon',
    sidebarHeader: {
      enabled: true,
      title: 'Lagoon Plugin',
      icon: '/images/lagoon-icon.png',
    },
    sidebar: [
      {
        text: 'Overview',
        link: '/index.html',
      },
      '/getting-started.html',
      '/config.html',
      '/tooling.html',
      '/sync.html',
      {
        text: 'Guides',
        collapsible: true,
        children: [
          {
            text: 'Externally accessing services',
            link: '/external-access.html',
          },
        ],
      },
      '/support.html',
      {text: 'Examples', link: 'https://github.com/lando/lagoon/tree/main/examples'},
      {text: 'Release Notes', link: 'https://github.com/lando/lagoon/releases'},
      '/development.html',
    ],
  },
};
