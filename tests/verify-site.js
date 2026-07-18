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
expectContains("profile long-scroll scene", "cinematic-profile");
expectContains("profile portrait panel", "profile-portrait");
expectContains("project dark lab scene", "cinematic-lab");
expectContains("project lab console", "lab-screen");
expectContains("idea star map scene", "cinematic-orbit");
expectContains("idea orbit core", "orbit-core");
expectContains("reading wide shelf scene", "cinematic-library");
expectContains("reading horizontal bookshelf", "library-aisle");
expectContains("photo exhibition wall scene", "cinematic-gallery");
expectContains("photo wide exhibition wall", "gallery-hero");
expectContains("wide stage CSS", ".cinematic-stage");
expectContains("desktop wide page target", "min(1680px, calc(100vw - 112px))");
expectContains("desktop 1440 1920 note", "1440 / 1920");
expectContains("profile desktop minimum", "min-width: 1260px");
expectContains("desktop stage height", "min-height: clamp(620px, 68vh, 820px)");
expectContains("preface wide scene", "preface-stage");
expectContains("timeline wide scene", "timeline-panorama");
expectContains("thoughts wide scene", "thought-manuscript");
expectContains("failure wide scene", "failure-vault");
expectContains("journal wide scene", "journal-calendar");
expectContains("future wide scene", "future-desk");
expectContains("afterword wide scene", "afterword-desk");
expectContains("timeline desktop note", "时间轴是一条 1440 / 1920 宽屏成长长廊");
expectContains("thought desktop note", "思考是一张 1440 / 1920 宽屏手稿桌");
expectContains("failure desktop note", "失败记录是一间 1440 / 1920 宽屏档案库");
expectContains("journal desktop note", "每日记录是一面 1440 / 1920 宽屏日历墙");
expectContains("future desktop note", "给未来的信是一张 1440 / 1920 宽屏书桌");
expectContains("afterword desktop note", "后记是一封 1440 / 1920 宽屏收束信");

const oldSmallModuleMarkers = [
  "profile-id",
  "lab-files",
  "book-spine summary",
  "photo-grid"
];
for (const marker of oldSmallModuleMarkers) {
  if (html.includes(marker)) {
    throw new Error(`small module layout still present: ${marker}`);
  }
}

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
