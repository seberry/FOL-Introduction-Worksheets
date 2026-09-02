import { chromium } from "playwright-core";

const baseUrl = process.env.APP_URL ?? "http://127.0.0.1:5173/";
const browser = await chromium.launch({ executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const browserErrors = [];
page.on("console", (message) => { if (message.type() === "error") browserErrors.push(message.text()); });
page.on("pageerror", (error) => browserErrors.push(error.message));

function assert(condition, message) { if (!condition) throw new Error(message); }
async function assertNoHorizontalOverflow(label) {
  const sizes = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, page: document.documentElement.scrollWidth }));
  assert(sizes.page <= sizes.viewport + 1, `${label} has horizontal overflow: ${sizes.page}px in ${sizes.viewport}px`);
}
async function goHome() { await page.locator(".app-header").getByRole("button", { name: "Home", exact: true }).click(); }
async function setPresentation(name) {
  await page.locator(".app-header").getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: new RegExp(`^${name}`) }).click();
}
async function answerCurrentProblem(correct = true) {
  const prompt = page.locator(".expanded-case-prompt, .problem-expression").first();
  const label = (await prompt.getAttribute("aria-label")) ?? "";
  const values = [...label.matchAll(/\b(true|false)\b/g)].map((match) => match[1] === "true");
  assert(values.length >= 1, `Could not read semantic truth values from ${label}`);
  const [left, right] = values;
  const expected = label.includes("not ") ? !left
    : label.includes("if and only if") ? left === right
      : label.includes("if then") ? !left || right
        : label.includes(" or ") ? left || right : left && right;
  await page.keyboard.press((correct ? expected : !expected) ? "t" : "f");
}

try {
  await page.addInitScript(() => localStorage.clear());
  await page.goto(`${baseUrl}?instructor=1`, { waitUntil: "networkidle" });
  await assertNoHorizontalOverflow("desktop home");
  await page.screenshot({ path: "artifacts/desktop-home.png", fullPage: true });

  await page.getByRole("button", { name: /^2\. NOT/ }).click();
  await page.getByRole("button", { name: /Start practice/i }).click();
  await assertNoHorizontalOverflow("expanded NOT");
  await page.screenshot({ path: "artifacts/desktop-expanded-not.png", fullPage: true });
  await answerCurrentProblem(true);
  await page.waitForTimeout(850);
  await answerCurrentProblem(true);
  await page.getByRole("heading", { name: "Quicker notation" }).waitFor();
  await page.screenshot({ path: "artifacts/desktop-shorthand-transition.png", fullPage: true });
  await page.getByRole("button", { name: /Continue with shorthand/ }).click();
  await assertNoHorizontalOverflow("compact NOT");
  await page.screenshot({ path: "artifacts/desktop-compact-not.png", fullPage: true });
  await answerCurrentProblem(false);
  await page.getByText(/Not quite/).waitFor();
  await page.screenshot({ path: "artifacts/desktop-compact-feedback.png", fullPage: true });
  await page.getByRole("button", { name: "About T and F" }).click();
  await page.screenshot({ path: "artifacts/desktop-tf-information.png", fullPage: true });
  await page.keyboard.press("Escape");

  await goHome();
  await page.getByRole("button", { name: /^3\. AND/ }).click();
  await page.getByRole("button", { name: /Start practice/i }).click();
  await assertNoHorizontalOverflow("expanded AND");
  await page.screenshot({ path: "artifacts/desktop-expanded-and.png", fullPage: true });

  await goHome();
  await setPresentation("Expanded");
  await page.screenshot({ path: "artifacts/desktop-settings-expanded.png", fullPage: true });
  await goHome();
  await page.getByRole("button", { name: /^7\. Mixed practice/ }).click();
  await answerCurrentProblem(false);
  await page.getByText(/Not quite/).waitFor();
  await page.screenshot({ path: "artifacts/desktop-expanded-feedback.png", fullPage: true });

  await goHome();
  await setPresentation("Compact");
  await page.screenshot({ path: "artifacts/desktop-settings-compact.png", fullPage: true });
  await goHome();
  await page.getByRole("button", { name: /^7\. Mixed practice/ }).click();
  await page.screenshot({ path: "artifacts/desktop-mixed-compact.png", fullPage: true });
  await goHome();
  await page.getByRole("button", { name: /^9\. Alternate notation/ }).click();
  await page.getByRole("button", { name: /Try two cases/i }).click();
  await page.screenshot({ path: "artifacts/desktop-alternate-compact.png", fullPage: true });
  await goHome();
  await page.getByRole("button", { name: /^8\. Complete truth tables/ }).click();
  await page.screenshot({ path: "artifacts/desktop-table.png", fullPage: true });

  await goHome();
  await page.locator(".app-header").getByRole("button", { name: "Progress", exact: true }).click();
  await assertNoHorizontalOverflow("desktop progress");
  await page.screenshot({ path: "artifacts/desktop-progress.png", fullPage: true });
  await goHome();
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow("mobile home");
  await page.screenshot({ path: "artifacts/mobile-home.png", fullPage: true });
  await page.getByRole("button", { name: /^2\. NOT/ }).click();
  await page.getByRole("button", { name: /Start practice/i }).click();
  await assertNoHorizontalOverflow("mobile compact NOT");
  await page.screenshot({ path: "artifacts/mobile-compact-not.png", fullPage: true });

  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(" | ")}`);
  console.log(JSON.stringify({ passed: true, flows: ["guided", "transition", "expanded", "compact", "mixed", "alternate", "table", "progress"], screenshots: 15, browserErrors: browserErrors.length }, null, 2));
} finally {
  await browser.close();
}
