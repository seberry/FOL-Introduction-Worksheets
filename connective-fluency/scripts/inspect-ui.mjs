import { chromium } from "playwright-core";

const baseUrl = process.env.APP_URL ?? "http://127.0.0.1:5173/";
const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const browserErrors = [];
page.on("console", (message) => {
  if (message.type() === "error") browserErrors.push(message.text());
});
page.on("pageerror", (error) => browserErrors.push(error.message));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function assertNoHorizontalOverflow(label) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  assert(sizes.page <= sizes.viewport + 1, `${label} has horizontal overflow: ${sizes.page}px in ${sizes.viewport}px`);
}

async function answerCurrentProblem(correct = true) {
  const text = (await page.locator(".problem-expression").first().innerText()).replaceAll(" ", "");
  const values = text.match(/TRUE|FALSE|T|F/g) ?? [];
  assert(values.length >= 1, `Could not read truth values from ${text}`);
  const isTrue = (value) => value === "TRUE" || value === "T";
  let expected;
  if (text.startsWith("¬") || text.startsWith("~")) expected = !isTrue(values[0]);
  else {
    const left = isTrue(values[0]);
    const right = isTrue(values.at(-1));
    if (text.includes("∧") || text.includes("&")) expected = left && right;
    else if (text.includes("∨") || text.includes("v")) expected = left || right;
    else if (text.includes("↔") || text.includes("≡")) expected = left === right;
    else expected = !left || right;
  }
  await page.keyboard.press((correct ? expected : !expected) ? "t" : "f");
  return text;
}

try {
  await page.goto(`${baseUrl}?instructor=1`, { waitUntil: "networkidle" });
  await assertNoHorizontalOverflow("desktop home");
  await page.screenshot({ path: "artifacts/desktop-home.png", fullPage: true });

  await page.getByRole("button", { name: /Start with symbols/i }).click();
  for (let index = 0; index < 8; index += 1) {
    await page.locator(".recognition-choices button").nth(index % 2).click();
    await page.getByText(/Correct/).waitFor();
    await page.getByRole("button", { name: /^Next$/ }).click();
  }
  await page.getByRole("button", { name: /^Continue$/ }).click();

  await page.getByRole("button", { name: /^2\. NOT/ }).click();
  await page.getByRole("button", { name: /Start practice/i }).click();
  await answerCurrentProblem(true);
  await page.waitForTimeout(850);
  const missedExpression = await answerCurrentProblem(false);
  await page.getByText(/Not quite/).waitFor();
  await page.waitForTimeout(220);
  await page.screenshot({ path: "artifacts/desktop-error-feedback.png", fullPage: true });
  await page.getByRole("button", { name: /Next case/i }).click();
  const interveningExpression = await page.locator(".problem-expression").innerText();
  assert(interveningExpression.replaceAll(" ", "") !== missedExpression, "A miss repeated immediately.");
  await answerCurrentProblem(true);
  await page.waitForTimeout(850);
  const repeatedExpression = (await page.locator(".problem-expression").innerText()).replaceAll(" ", "");
  assert(repeatedExpression === missedExpression, "The missed unary case did not recur after an intervening question.");

  await page.locator(".app-header").getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: /^7\. Mixed practice/ }).click();
  await assertNoHorizontalOverflow("desktop binary practice");
  await page.screenshot({ path: "artifacts/desktop-binary-words.png", fullPage: true });
  for (let index = 0; index < 3; index += 1) {
    await answerCurrentProblem(true);
    await page.waitForTimeout(850);
  }

  await page.locator(".app-header").getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: /^8\. Build truth tables/ }).click();
  for (const key of ["t", "f", "f", "f"]) {
    await page.keyboard.press(key);
    await page.waitForTimeout(620);
  }
  await page.getByText(/You completed the truth table for AND/).waitFor();
  await page.screenshot({ path: "artifacts/desktop-completed-table.png", fullPage: true });

  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: /^9\. Alternate notation/ }).click();
  await page.getByRole("button", { name: /Try two cases/i }).click();
  await page.screenshot({ path: "artifacts/desktop-alternate-practice.png", fullPage: true });
  await page.keyboard.press("f");
  await page.waitForTimeout(750);
  await page.keyboard.press("t");
  await page.waitForTimeout(750);
  await page.getByText(/You already know AND/).waitFor();

  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "T / F" }).click();
  await page.locator(".app-header").getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: /^7\. Mixed practice/ }).click();
  await page.getByRole("button", { name: "About T and F" }).click();
  await assertNoHorizontalOverflow("T/F notation dialog");
  await page.screenshot({ path: "artifacts/desktop-tf-information.png", fullPage: true });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Home", exact: true }).click();
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: /TRUE \/ FALSE/ }).click();
  await page.locator(".app-header").getByRole("button", { name: "Home", exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await assertNoHorizontalOverflow("mobile home");
  await page.screenshot({ path: "artifacts/mobile-home.png", fullPage: true });
  await page.getByRole("button", { name: /^2\. NOT/ }).click();
  await page.getByRole("button", { name: /Start practice/i }).click();
  await assertNoHorizontalOverflow("mobile NOT practice");
  await page.screenshot({ path: "artifacts/mobile-not-words.png", fullPage: true });

  assert(browserErrors.length === 0, `Browser errors: ${browserErrors.join(" | ")}`);
  console.log(JSON.stringify({
    passed: true,
    flows: ["recognition", "lesson", "single-case", "miss-and-spaced-retry", "mixed", "table", "alternate"],
    screenshots: 9,
    browserErrors: browserErrors.length,
  }, null, 2));
} finally {
  await browser.close();
}
