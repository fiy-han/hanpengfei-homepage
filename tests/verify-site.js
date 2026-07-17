const fs = require("fs");

const html = fs.readFileSync("index.html", "utf8");
const visibleText = html.replace(/<[^>]+>/g, "");

function expectContains(label, text) {
  if (!html.includes(text)) {
    throw new Error(`${label} missing: ${text}`);
  }
}

expectContains("document title", "<title>《韩鹏飞》一本仍在书写中的书</title>");
expectContains("preface chapter label", "CHAPTER 00 / WHY RECORD");
expectContains("preface lede", "因为没有记录的经历，最终会消失。");
expectContains("preface section one", "为什么开始记录");
expectContains("preface section two", "记录如何改变自己");
expectContains("future letter section", "给未来自己的信");
expectContains("growth timeline", "开始建立人生档案");
expectContains("unfinished ending", "未完待续");
expectContains("book-like contents marker", "开卷目录");
expectContains("contents reading prompt", "这不是导航，是一本还在生长的书的索引。");
expectContains("contents shelf class", "contents-shelf");
expectContains("content editor panel", "contentEditor");
expectContains("content editor title input", "entryTitle");
expectContains("content editor body input", "entryBody");
expectContains("content editor save button", "saveEntryButton");
expectContains("local content storage", "hanpengfei.lifeBook.entries");
expectContains("save entry function", "function saveEntry");
expectContains("render entries function", "function renderUserEntries");
expectContains("entry type buttons", "data-entry-type");

if (!/\.cover-panel\s*\{[\s\S]*?border:\s*0;[\s\S]*?background:\s*transparent;[\s\S]*?backdrop-filter:\s*none;[\s\S]*?box-shadow:\s*none;/m.test(html)) {
  throw new Error("cover panel still looks like a framed card");
}

const mobileMediaMatch = html.match(/@media \(max-width: 860px\) \{([\s\S]*?)\n    \}/);
if (!mobileMediaMatch) {
  throw new Error("mobile media query missing");
}

if (!/\.reader-tools\s*\{[\s\S]*?top:\s*18px;[\s\S]*?right:\s*18px;[\s\S]*?bottom:\s*auto;[\s\S]*?left:\s*auto;/m.test(mobileMediaMatch[1])) {
  throw new Error("mobile reader tools are not positioned in the safe top-right area");
}

if (!/\.menu-button\s*\{[\s\S]*?top:\s*18px;[\s\S]*?left:\s*18px;/m.test(mobileMediaMatch[1])) {
  throw new Error("mobile menu button spacing missing");
}

if (!/\.cover,\s*[\s\S]*?\.contents,\s*[\s\S]*?\.chapter\s*\{[\s\S]*?padding-top:\s*86px;/m.test(mobileMediaMatch[1])) {
  throw new Error("mobile views are missing top safe spacing");
}

if (!/创建时间：\s*2026\.07\.17/.test(visibleText)) {
  throw new Error("created date missing in visible text");
}

if (!/最后修改：\s*2026\.07\.17/.test(visibleText)) {
  throw new Error("updated date missing in visible text");
}

const directoryNumbers = [...html.matchAll(/<span class="chapter-number">(\d{2})<\/span>/g)].map((match) => match[1]);
const expectedDirectoryNumbers = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11"];
if (directoryNumbers.join(",") !== expectedDirectoryNumbers.join(",")) {
  throw new Error(`directory numbers mismatch: got ${directoryNumbers.join(",")}`);
}

const chapterNumbers = [...html.matchAll(/number: "(\d{2})"/g)].map((match) => match[1]);
const sortedChapterNumbers = [...chapterNumbers].sort();
if (sortedChapterNumbers.join(",") !== expectedDirectoryNumbers.join(",")) {
  throw new Error(`chapter object numbers mismatch: got ${chapterNumbers.join(",")}`);
}

const orderMatch = html.match(/const chapterKeys = \[([\s\S]*?)\];/);
if (!orderMatch) {
  throw new Error("explicit chapterKeys order missing");
}

const chapterKeyOrder = [...orderMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]);
const expectedChapterKeyOrder = [
  "why-record",
  "about",
  "timeline",
  "projects",
  "thoughts",
  "reading",
  "photos",
  "ideas",
  "failures",
  "journal",
  "future",
  "contact"
];
if (chapterKeyOrder.join(",") !== expectedChapterKeyOrder.join(",")) {
  throw new Error(`chapter key order mismatch: got ${chapterKeyOrder.join(",")}`);
}

const mojibakeMarkers = ["銆", "楣", "闊", "乱码"];
for (const marker of mojibakeMarkers) {
  if (html.includes(marker)) {
    throw new Error(`mojibake marker found: ${marker}`);
  }
}

console.log("Site structure checks passed.");
