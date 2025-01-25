import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";

async function main() {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    const params = {
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      icon: {
        type: "emoji",
        emoji: "🚀"
      },
      properties: {
        Title: {
          title: [
            {
              text: {
                content: process.env.PR_TITLE || "No Title",
              },
            },
          ],
        },
        "リリース日": {
          date: {
            start: new Date().toISOString(),
            time_zone: "Asia/Tokyo",
          },
        },
        URL: {
          url: process.env.PR_URL,
        },
      },
      children: markdownToBlocks(process.env.PR_BODY || "No description"),
    };

    await notion.pages.create(params);
    console.log("Successfully created release note in Notion");
  } catch (e) {
    console.error("エラー:", e);
    process.exit(1);
  }
}

main(); 