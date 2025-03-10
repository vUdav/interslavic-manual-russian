import fs from "fs";
import path from "path";

export default (content, title, author) => {
  const formattedContent = content.map((chapter) => {
    return {
      ...chapter,
      data: chapter.data.replace(/src="src\/assets\/images\//g, 'src="images/'),
    };
  });

  const htmlDir = "./dist";
  fs.rmSync(htmlDir, { recursive: true, force: true });

  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  // Move assets
  const srcAssetsDir = path.join("src", "assets");
  const destAssetsDir = path.join(htmlDir);

  if (fs.existsSync(srcAssetsDir)) {
    fs.mkdirSync(destAssetsDir, { recursive: true });

    const copyDirectory = (src, dest) => {
      const entries = fs.readdirSync(src, { withFileTypes: true });

      entries.forEach((entry) => {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
          fs.mkdirSync(destPath, { recursive: true });
          copyDirectory(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    };

    copyDirectory(srcAssetsDir, destAssetsDir);
  }

  // Templates
  const tocTemplate = () => {
    const chaptersTemplate = formattedContent
      .map((chapter, index) => {
        return `<li>
          <a href="${index + 1}.html">${chapter.title}</a>
        </li>`;
      })
      .join("");

    return `
    <label for="toc-toggle" class="button">Содержание</label>
    <input type="checkbox" id="toc-toggle" class="toc-checkbox" />
    <nav class="toc">
      <label for="toc-toggle" class="button">Закрыть</label>
      <ul>
        <li>
          <a href="index.html">Обложка</a>
        </li>
        ${chaptersTemplate}
      </ul>
    </nav>
    `;
  };

  const navTemplate = (prevPage, nextPage) => {
    let prevPageTemplate = "";
    if (prevPage) {
      prevPageTemplate = `<a class="button" href="${prevPage}">Предыдущая глава</a>`;
    }

    let nextPageTemplate = "";
    if (nextPage) {
      nextPageTemplate = `<a class="button" href="${nextPage}">Следующая глава</a>`;
    }

    return `
      <nav class="nav">
        <hr/>
        <ul>
          <li>
            ${prevPageTemplate}
          </li>
          <li>
            ${nextPageTemplate}
          </li>
        </ul>
      </nav>
    `;
  };

  const template = (title, content, prevPage, nextPage) =>
    `<!DOCTYPE html>
      <html lang="ru">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <link rel="stylesheet" href="styles/style.css">
        <link rel="stylesheet" href="styles/html-book.css">
      </head>
      <body>
        <div class="container">
          ${tocTemplate()}
          <h1>${title}</h1>
          ${content}
          ${navTemplate(prevPage, nextPage)}
        </div>
      </body>
      </html>`;

  // Main page
  const mainPageContent = `
    <img src="images/cover.jpg" alt="Обложка" />
  `;
  fs.writeFileSync(
    path.join(htmlDir, "index.html"),
    template(`${author} - ${title}`, mainPageContent, undefined, "1.html"),
    "utf8"
  );

  // Chapters
  formattedContent.forEach((chapter, index) => {
    const prevPage = index > 0 ? `${index}.html` : "index.html";
    const nextPage =
      index < formattedContent.length - 1 ? `${index + 2}.html` : undefined;

    fs.writeFileSync(
      path.join(htmlDir, `${index + 1}.html`),
      template(chapter.title, chapter.data, prevPage, nextPage),
      "utf8"
    );
  });
};
