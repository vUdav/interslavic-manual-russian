import { EPub } from "@lesjoursfr/html-to-epub";
import fs from "fs";
import path from "path";
import markdownit from "markdown-it";
import markdownAttrs from "markdown-it-attrs";
import markdownFootnote from "markdown-it-footnote";
import markdownImageFigures from "markdown-it-image-figures";
import markdownSup from "markdown-it-sup";

const md = markdownit({
  xhtmlOut: true,
  breaks: true,
})
  .use(markdownAttrs)
  .use(markdownFootnote)
  .use(markdownImageFigures, {
    figcaption: true,
  })
  .use(markdownSup);

// Chapters
const chaptersDir = "./src/texts";
const chapterFiles = fs
  .readdirSync(chaptersDir)
  .filter((file) => file.endsWith(".md"))
  .sort((a, b) => {
    const aNum = parseInt(a.split("__")[0]);
    const bNum = parseInt(b.split("__")[0]);
    return aNum - bNum;
  });

const content = chapterFiles.map((file) => {
  const title = file.replace(/^\d+__/, "").replace(".md", "");
  let data = md
    .render(fs.readFileSync(path.join(chaptersDir, file), "utf8"))
    .replace(/src="src\/assets\/images\//g, 'src="file://src/assets/images/');
  return { title, data };
});

// Options
const option = {
  title:
    "Межславянский. Искусственный зональный язык. Учебное пособие для русскоговорящих.",
  author: "Войтех Мерунка",
  cover: "./src/assets/images/cover.jpg",
  fonts: ["./src/assets/fonts/Shafarik-Regular.ttf"],
  css: fs.readFileSync("./src/assets/styles/style.css", "utf8"),
  lang: "ru",
  tocTitle: "Содержание",
  content,
};

// Generate EPub
const epub = new EPub(option, "build/output.epub");

epub
  .render()
  .then(() => {
    console.log("Ebook Generated Successfully!");
  })
  .catch((err) => {
    console.error("Failed to generate Ebook because of ", err);
  });

// Generate HTML
const htmlDir = "./build/html";
if (!fs.existsSync(htmlDir)) {
  fs.mkdirSync(htmlDir, { recursive: true });
}

content.forEach((chapter, index) => {
  fs.writeFileSync(
    path.join(htmlDir, `chapter-${index + 1}.html`),
    `<!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <title>${chapter.title}</title>
        <link rel="stylesheet" href="style.css">
      </head>
      <body>
        <h1>${chapter.title}</h1>
        ${chapter.data}
      </body>
      </html>`,
    "utf8"
  );
});
