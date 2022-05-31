// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: "layout-manager",
    tagline: "layout-manager is a layout manager for React",
    url: "https://idealjs.github.io/layout-manager",
    baseUrl: "/",
    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",
    favicon: "img/favicon.ico",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "idealjs", // Usually your GitHub org/user name.
    projectName: "@idealjs/layout-manager", // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "zh-Hans",
        locales: ["zh-Hans"],
    },

    presets: [
        [
            "classic",
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve("./sidebars.js"),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl:
                        "https://github.com/idealjs/layout-manager/tree/main/website",
                },
                theme: {
                    customCss: require.resolve("./src/css/custom.css"),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: "Layout Manager",
                logo: {
                    alt: "My Site Logo",
                    src: "img/logo.svg",
                },
                items: [
                    {
                        type: "doc",
                        docId: "intro",
                        position: "left",
                        label: "Tutorial",
                    },
                    {
                        href: "https://github.com/idealjs/layout-manager/",
                        label: "GitHub",
                        position: "right",
                    },
                ],
            },
            footer: {
                style: "dark",
                links: [
                    {
                        title: "Docs",
                        items: [
                            {
                                label: "Tutorial",
                                to: "/docs/intro",
                            },
                        ],
                    },
                    {
                        title: "Community",
                        items: [
                            // {
                            //     label: "Stack Overflow",
                            //     href: "https://stackoverflow.com/questions/tagged/docusaurus",
                            // },
                            // {
                            //     label: "Discord",
                            //     href: "https://discordapp.com/invite/docusaurus",
                            // },
                            // {
                            //     label: "Twitter",
                            //     href: "https://twitter.com/docusaurus",
                            // },
                        ],
                    },
                    {
                        title: "More",
                        items: [
                            // {
                            //     label: "Blog",
                            //     to: "/blog",
                            // },
                            // {
                            //     label: "GitHub",
                            //     href: "https://github.com/facebook/docusaurus",
                            // },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Layout Manager, Inc. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
