import { Client } from "@notionhq/client";
import { markdownToBlocks } from "@tryfabric/martian";

async function main() {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Base64でエンコードされた本文をデコード
    const prBody = process.env.PR_BODY
      ? Buffer.from(process.env.PR_BODY, 'base64').toString()
      : "No description";

    const params = {
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      icon: {
        type: "emoji",
        emoji: "🚀"
      },
      properties: {
        "Pull Request Title": {
          title: [
            {
              text: {
                content: process.env.PR_TITLE || "No Title",
              },
            },
          ],
        },
        "Description": {
          rich_text: [
            {
              text: {
                content: prBody,
              },
            },
          ],
        },
        "Created Date": {
          date: {
            start: new Date().toISOString(),
            time_zone: "Asia/Tokyo",
          },
        },
        "URL": {
          url: process.env.PR_URL,
        },
      },
      children: markdownToBlocks(prBody),
    };

    // FIXME: 型エラー
    await notion.pages.create(params);
    console.log("Successfully created release note in Notion");
  } catch (e) {
    console.error("エラー:", e);
    process.exit(1);
  }
}

main(); 