import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "static",
  },
  // Uncomment to allow cross-origin requests from non-localhost origins
  // during local development (e.g. GitHub Codespaces, Gitpod, Docker).
  // Use 'private' to allow all private-network IPs (WSL2, Docker, etc.)
  // server: {
  //   allowedOrigins: ['https://your-codespace.github.dev'],
  // },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "static",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/r/content-modelling-collections/
  schema: {
    collections: [
      {
        label: "Components",
        name: "components",
        path: "docs/components",
        format: "mdx",
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "status",
                label: "Status",
                options: ["draft", "in-review", "stable", "deprecated"],
              },
              {
                type: "string",
                name: "platforms",
                label: "Platforms",
                list: true,
                options: ["web", "ios", "android"],
              },
              {
                type: "string",
                name: "category",
                label: "Category",
              },
              {
                type: "string",
                name: "figma_node",
                label: "Figma Node ID",
              },
              {
                type: "string",
                name: "used_in",
                label: "Used In",
                list: true,
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
      {
        label: "Guidelines",
        name: "guidelines",
        path: "docs/guidelines",
        format: "mdx",
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            fields: [
              {
                type: "string",
                name: "title",
                label: "Title",
                isTitle: true,
                required: true,
              },
              {
                type: "string",
                name: "status",
                label: "Status",
                options: ["draft", "in-review", "stable", "deprecated"],
              },
              {
                type: "string",
                name: "tags",
                label: "Tags",
                list: true,
              },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
      },
    ],
  },
});
