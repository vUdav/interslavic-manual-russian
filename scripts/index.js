import mdToHtml from "./mdToHtml.js";
import genEpub from "./genEpub.js";
import genHtmlPages from "./genHtmlPages.js";

const content = mdToHtml();
const author = "Войтех Мерунка";
const title =
  "Межславянский. Искусственный зональный язык. Учебное пособие для русскоговорящих.";

genEpub(content, title, author);
genHtmlPages(content, title, author);
