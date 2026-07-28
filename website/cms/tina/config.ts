import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID || "",
  token: process.env.TINA_TOKEN || "",
  build: {
    outputDir: "admin",
    publicDir: "../public",
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "../../static",
    },
  },
  schema: {
    collections: [
      {
        label: "Components",
        name: "components",
        path: "../docs/components",
        format: "mdx",
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            ui: {
              itemProps: (item: any) => {
                return { label: item.title };
              },
            },
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
                label: "Used In (flows)",
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
        path: "../docs/guidelines",
        format: "mdx",
        fields: [
          {
            type: "object",
            list: false,
            name: "frontmatter",
            label: "Front Matter",
            ui: {
              itemProps: (item: any) => {
                return { label: item.title };
              },
            },
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
