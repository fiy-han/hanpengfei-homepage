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
