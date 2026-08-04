import { defineConfig } from "tinacms";

export default defineConfig({
  branch: "main",
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID, 
  token: process.env.TINA_TOKEN, 
  build: {
    outputFolder: "admin",
    publicFolder: "static", // Crucial for Docusaurus static asset routing
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
        path: "docs", // Directs Tina to your Docusaurus docs folder
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "sidebar_label", label: "Sidebar Label" },
          { type: "rich-text", name: "body", label: "Body", isBody: true },
        ],
      },
    ],
  },
});