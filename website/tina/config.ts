import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, 
  token: process.env.TINA_TOKEN, 
  build: {
    outputFolder: "admin",
    publicFolder: "static", // Crucial for Docusaurus static asset routing
    basePath: "flamingo", // Docusaurus serves this site under /flamingo/, not /
  },
  media: {
    tina: {
      mediaRoot: "img",
      publicFolder: "static",
    },
  },
  schema: {
    collections: [
      {
        name: "doc",
        label: "Documentation",
        path: "website/docs", // Directs Tina to your Docusaurus docs folder (repo-root-relative — testing whether TinaCloud resolves paths from repo root rather than the tina/ folder's location)
        format: "mdx", // All content here is .mdx, not .md — Tina defaults to .md only
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "sidebar_label", label: "Sidebar Label" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});