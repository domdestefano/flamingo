import { defineConfig } from "tinacms";

// Every zero-prop token reference component under src/components/DesignTokens/
// (Colours, SpacingSizing, Typography) — each is a fully hardcoded renderer with
// no props, so they all get the same empty-fields template shape.
const ZERO_PROP_TOKEN_COMPONENTS = [
  "ColourPrinciples",
  "PrimaryColours",
  "NeutralColours",
  "StatusColours",
  "BackgroundColours",
  "OverlayColours",
  "ShadowColours",
  "TransparentColours",
  "IllustrationColours",
  "SpacingTokens",
  "CornerRadiusTokens",
  "BorderThicknessTokens",
  "OpacityTokens",
  "BlurTokens",
  "FontFamilyTokens",
  "FontSizeTokens",
  "LineHeightTokens",
  "LetterSpacingTokens",
  "ParagraphSpacingTokens",
  "ListSpacingTokens",
  "TypographyGuidelines",
];

const STATUS_OPTIONS = ["draft", "in-review", "stable", "in-progress", "deprecated"];
const AVAILABILITY_OPTIONS = ["available", "in-progress", "not-available"];
const CATEGORY_OPTIONS = [
  "buttons",
  "content-display-and-lists",
  "feedback",
  "form",
  "layout",
  "loaders",
  "navigation",
  "overlay",
  "progressors-and-charts",
];

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
        path: "docs", // Relative to TinaCloud's "Path to Tina Folder" project setting ("website") — resolves to website/docs
        format: "mdx",
        fields: [
          { type: "string", name: "title", label: "Title", isTitle: true, required: true },
          { type: "string", name: "sidebar_label", label: "Sidebar Label" },
          { type: "string", name: "status", label: "Status", options: STATUS_OPTIONS },
          { type: "number", name: "sidebar_position", label: "Sidebar Position" },
          { type: "string", name: "tags", label: "Tags", list: true },
          { type: "string", name: "platforms", label: "Platforms", list: true },
          { type: "string", name: "category", label: "Category", options: CATEGORY_OPTIONS },
          { type: "string", name: "figma_node", label: "Figma Node" },
          { type: "string", name: "used_in", label: "Used In", list: true },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
            templates: [
              {
                name: "ComponentImage",
                label: "Component Image",
                fields: [
                  { type: "string", name: "src", label: "Source", required: true },
                  { type: "string", name: "alt", label: "Alt Text", required: true },
                  { type: "number", name: "width", label: "Width" },
                ],
              },
              {
                name: "ComponentTabs",
                label: "Component Tabs",
                fields: [
                  { type: "string", name: "basePath", label: "Base Path", required: true },
                  {
                    type: "object",
                    name: "tabs",
                    label: "Tabs",
                    list: true,
                    fields: [
                      { type: "string", name: "label", label: "Label", required: true },
                      { type: "string", name: "slug", label: "Slug", required: true },
                    ],
                  },
                ],
              },
              {
                name: "StorybookEmbed",
                label: "Storybook Embed",
                fields: [
                  { type: "string", name: "storyId", label: "Story ID", required: true },
                  { type: "number", name: "height", label: "Height" },
                  { type: "string", name: "baseUrl", label: "Base URL" },
                  { type: "string", name: "viewMode", label: "View Mode", options: ["story", "docs"] },
                ],
              },
              {
                name: "StatusBadge",
                label: "Status Badge",
                inline: true,
                fields: [
                  { type: "string", name: "status", label: "Status", options: STATUS_OPTIONS },
                ],
              },
              {
                name: "AvailabilityTable",
                label: "Availability Table",
                fields: [
                  { type: "string", name: "figma", label: "Figma", required: true, options: AVAILABILITY_OPTIONS },
                  { type: "string", name: "web", label: "Web", required: true, options: AVAILABILITY_OPTIONS },
                  { type: "string", name: "ios", label: "iOS", required: true, options: AVAILABILITY_OPTIONS },
                  { type: "string", name: "android", label: "Android", required: true, options: AVAILABILITY_OPTIONS },
                  { type: "string", name: "specs", label: "Specs", required: true, options: AVAILABILITY_OPTIONS },
                ],
              },
              {
                name: "PropsTable",
                label: "Props Table",
                fields: [
                  {
                    type: "object",
                    name: "rows",
                    label: "Rows",
                    list: true,
                    required: true,
                    fields: [
                      { type: "string", name: "name", label: "Name", required: true },
                      { type: "string", name: "description", label: "Description", required: true },
                      { type: "string", name: "type", label: "Type" },
                      { type: "string", name: "default", label: "Default" },
                    ],
                  },
                ],
              },
              {
                name: "DoDontTable",
                label: "Do / Don't Table",
                fields: [
                  { type: "string", name: "doImage", label: "Do Image" },
                  { type: "rich-text", name: "doText", label: "Do Text", required: true },
                  { type: "string", name: "dontImage", label: "Don't Image" },
                  { type: "rich-text", name: "dontText", label: "Don't Text", required: true },
                ],
              },
              {
                name: "CautionTable",
                label: "Caution Table",
                fields: [
                  { type: "string", name: "image", label: "Image" },
                  { type: "rich-text", name: "text", label: "Text", required: true },
                ],
              },
              {
                name: "ChangelogTable",
                label: "Changelog Table",
                fields: [
                  {
                    type: "object",
                    name: "rows",
                    label: "Rows",
                    list: true,
                    required: true,
                    fields: [
                      { type: "string", name: "date", label: "Date", required: true },
                      { type: "string", name: "version", label: "Version", required: true },
                      { type: "rich-text", name: "description", label: "Description", required: true },
                    ],
                  },
                ],
              },
              {
                name: "UpdateBanner",
                label: "Update Banner",
                fields: [
                  { type: "string", name: "date", label: "Date", required: true },
                ],
              },
              {
                name: "PeopleList",
                label: "People List",
                fields: [
                  {
                    type: "object",
                    name: "people",
                    label: "People",
                    list: true,
                    required: true,
                    fields: [
                      { type: "string", name: "name", label: "Name", required: true },
                      { type: "string", name: "role", label: "Role" },
                    ],
                  },
                ],
              },
              // GraphQL forbids a zero-field input type, so each of these
              // otherwise-propless components needs at least one field —
              // this one is inert, purely to satisfy that constraint.
              ...ZERO_PROP_TOKEN_COMPONENTS.map((name) => ({
                name,
                label: name,
                fields: [
                  { type: "string", name: "_unused", label: "(no editable properties)" },
                ],
              })),
            ],
          },
        ],
      },
    ],
  },
});
