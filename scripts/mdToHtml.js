import fs from "fs";
import path from "path";
import markdownit from "markdown-it";
import markdownAttrs from "markdown-it-attrs";
import markdownFootnote from "markdown-it-footnote";
import markdownImageFigures from "markdown-it-image-figures";
import markdownSup from "markdown-it-sup";

export default () => {
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
    const filename = file.split("__")[0];
    let data = md.render(fs.readFileSync(path.join(chaptersDir, file), "utf8"));
    return { title, data, filename };
  });

  return content;
};
