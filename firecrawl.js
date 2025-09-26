require('dotenv').config();
const FirecrawlApp = require('firecrawl').default;
const { Client } = require('@notionhq/client');

const firecrawl = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function fetchSecurityNews() {
  try {
    const result = await firecrawl.scrapeUrl("https://www.boannews.com/media/t_list.asp");
    const text = result.success ? result.data.markdown : "뉴스 가져오기 실패";

    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: {
          title: [{ text: { content: "자동 수집된 보안 뉴스" } }]
        }
      },
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: [{ type: "text", text: { content: text } }] }
        }
      ]
    });

    console.log("✅ 뉴스가 노션에 업로드되었습니다!");
  } catch (error) {
    console.error("❌ 오류 발생:", error);
  }
}

fetchSecurityNews();

