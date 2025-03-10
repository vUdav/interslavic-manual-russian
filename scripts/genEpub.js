import fs from "fs";
import { EPub } from "@lesjoursfr/html-to-epub";

export default (content, title, author) => {
  const htmlDir = "./build";

  fs.rmSync(htmlDir, { recursive: true, force: true });

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  const formattedContent = content.map((chapter) => {
    return {
      ...chapter,
      data: chapter.data.replace(
        /src="src\/assets\/images\//g,
        'src="file://src/assets/images/'
      ),
    };
  });

  // Options
  const option = {
    title,
    author,
    cover: "./src/assets/images/cover.jpg",
    fonts: ["./src/assets/fonts/Shafarik-Regular.ttf"],
    css: fs.readFileSync("./src/assets/styles/style.css", "utf8"),
    lang: "ru",
    tocTitle: "Содержание",
    content: formattedContent,
  };

  // Generate EPub
  const epub = new EPub(option, `${htmlDir}/${author} - ${title}.epub`);

  epub
    .render()
    .then(() => {
      console.log("Ebook Generated Successfully!");
    })
    .catch((err) => {
      console.error("Failed to generate Ebook because of ", err);
    });
};
