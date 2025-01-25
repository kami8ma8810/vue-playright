import { Client } from "@notionhq/client";
import { CreatePageParameters } from "@notionhq/client/build/src/api-endpoints";

async function main() {
  const databaseId = process.env.NOTION_DATABASE_ID;
  if (!databaseId) {
    console.error("NOTION_DATABASE_ID が設定されていません");
    process.exit(1);
  }

  const githubUrl = process.env.PR_URL;
  if (!githubUrl) {
    console.error("Pull Request URL がありません");
    process.exit(1);
  }

  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });

    // Labels の取得
    const labels = process.env.PR_LABELS ? JSON.parse(process.env.PR_LABELS) : [];
    const labelNames = labels.map((label: { name: string }) => ({ name: label.name }));

    // Base64 でエンコードされた本文をデコード
    const prBody = process.env.PR_BODY
      ? Buffer.from(process.env.PR_BODY, 'base64').toString()
      : "No description";

    const params: CreatePageParameters = {
      parent: {
        database_id: databaseId,
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
        // Labels は複数選択可能なので multi_select を使用
        "Labels": {
          multi_select: labelNames,
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
          url: githubUrl,
        },
      },
    };

    await notion.pages.create(params);
    console.log("Notion にリリースノートを作成しました");
  } catch (e) {
    console.error("エラー:", e);
    process.exit(1);
  }
}

main(); 