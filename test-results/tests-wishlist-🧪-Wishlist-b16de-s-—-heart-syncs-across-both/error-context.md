# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests/wishlist.spec.ts >> 🧪 Wishlist Feature — Full QA Suite >> ✅ Case 3: Same product in 2 sections — heart syncs across both
- Location: tests/wishlist.spec.ts:88:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1   | // tests/wishlist.spec.ts
  2   | import { test, expect, Page } from "@playwright/test";
  3   |
  4   | // ─── Config ───────────────────────────────────────────────────────────────────
  5   | const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
  6   | const TEST_EMAIL = process.env.TEST_EMAIL || "testuser@example.com";
  7   | const TEST_PASSWORD = process.env.TEST_PASSWORD || "testpassword";
  8   |
  9   | // ─── Helpers ──────────────────────────────────────────────────────────────────
  10  | async function login(page: Page) {
  11  |   await page.goto(`${BASE_URL}`);
  12  |   await page.getByRole("button", { name: /login/i }).click();
  13  |   await page.getByPlaceholder(/email/i).fill(TEST_EMAIL);
  14  |   await page.getByPlaceholder(/password/i).fill(TEST_PASSWORD);
  15  |   await page.getByRole("button", { name: /^login$/i }).click();
  16  |   await page.waitForTimeout(1500); // wait for auth
  17  | }
  18  |
  19  | async function getZustandWishlistState(page: Page): Promise<Record<string, boolean>> {
  20  |   return page.evaluate(() => {
  21  |     // Access Zustand store from window — works if store is exposed
  22  |     const store = (window as any).__wishlistStore?.getState?.();
  23  |     return store?.wishlistedIds ?? {};
  24  |   });
  25  | }
  26  |
  27  | async function getProductCardHeartState(page: Page, nth = 0): Promise<"filled" | "empty" | "loading"> {
  28  |   const card = page.locator('[data-testid="product-card"]').nth(nth);
  29  |   const spinner = card.locator('[data-testid="wishlist-spinner"]');
  30  |   const filledHeart = card.locator('[data-testid="heart-filled"]');
  31  |   const emptyHeart = card.locator('[data-testid="heart-empty"]');
  32  |
  33  |   if (await spinner.isVisible()) return "loading";
  34  |   if (await filledHeart.isVisible()) return "filled";
  35  |   return "empty";
  36  | }
  37  |
  38  | // ─── Tests ────────────────────────────────────────────────────────────────────
  39  | test.describe("🧪 Wishlist Feature — Full QA Suite", () => {
> 40  |   test.beforeEach(async ({ page }) => {
      |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  41  |     await login(page);
  42  |     await page.goto(`${BASE_URL}/products`);
  43  |     await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
  44  |   });
  45  |
  46  |   // ── Case 1: Add to wishlist ────────────────────────────────────────────────
  47  |   test("✅ Case 1: Click heart → adds to wishlist, heart turns red", async ({ page }) => {
  48  |     const card = page.locator('[data-testid="product-card"]').first();
  49  |
  50  |     // Hover to reveal wishlist button
  51  |     await card.hover();
  52  |     const heartBtn = card.locator('[data-testid="wishlist-btn"]');
  53  |     await heartBtn.waitFor({ state: "visible" });
  54  |
  55  |     const beforeState = await getProductCardHeartState(page, 0);
  56  |     expect(beforeState).toBe("empty");
  57  |
  58  |     await heartBtn.click();
  59  |     await page.waitForTimeout(500); // optimistic update
  60  |
  61  |     const afterState = await getProductCardHeartState(page, 0);
  62  |     expect(afterState).toBe("filled");
  63  |
  64  |     // Check toast
  65  |     await expect(page.locator("text=Added to wishlist")).toBeVisible({ timeout: 3000 });
  66  |   });
  67  |
  68  |   // ── Case 2: Remove from wishlist ──────────────────────────────────────────
  69  |   test("✅ Case 2: Click red heart again → removes from wishlist", async ({ page }) => {
  70  |     const card = page.locator('[data-testid="product-card"]').first();
  71  |     await card.hover();
  72  |     const heartBtn = card.locator('[data-testid="wishlist-btn"]');
  73  |
  74  |     // Add first
  75  |     await heartBtn.click();
  76  |     await page.waitForTimeout(800);
  77  |     expect(await getProductCardHeartState(page, 0)).toBe("filled");
  78  |
  79  |     // Remove
  80  |     await heartBtn.click();
  81  |     await page.waitForTimeout(800);
  82  |     expect(await getProductCardHeartState(page, 0)).toBe("empty");
  83  |
  84  |     await expect(page.locator("text=Removed from wishlist")).toBeVisible({ timeout: 3000 });
  85  |   });
  86  |
  87  |   // ── Case 3: Same product in 2 sections syncs ──────────────────────────────
  88  |   test("✅ Case 3: Same product in 2 sections — heart syncs across both", async ({ page }) => {
  89  |     // Find a product ID that appears in multiple sections
  90  |     const allCards = page.locator('[data-testid="product-card"]');
  91  |     const firstProductId = await allCards.first().getAttribute("data-product-id");
  92  |
  93  |     // Find second instance of the same product
  94  |     const duplicateCard = page.locator(`[data-product-id="${firstProductId}"]`).nth(1);
  95  |     const firstCard = page.locator(`[data-product-id="${firstProductId}"]`).first();
  96  |
  97  |     // Click heart on first card
  98  |     await firstCard.hover();
  99  |     await firstCard.locator('[data-testid="wishlist-btn"]').click();
  100 |     await page.waitForTimeout(800);
  101 |
  102 |     // Second card should also show filled heart without clicking
  103 |     const secondCardState = await duplicateCard.locator('[data-testid="heart-filled"]').isVisible();
  104 |     expect(secondCardState).toBe(true);
  105 |
  106 |     console.log("✅ Cross-section sync works");
  107 |   });
  108 |
  109 |   // ── Case 4: Double-click protection ───────────────────────────────────────
  110 |   test("✅ Case 4: Double-click → only fires API once", async ({ page }) => {
  111 |     const apiCalls: string[] = [];
  112 |
  113 |     // Intercept wishlist API
  114 |     await page.route("**/wishlist**", (route) => {
  115 |       if (route.request().method() === "POST") {
  116 |         apiCalls.push(route.request().url());
  117 |       }
  118 |       route.continue();
  119 |     });
  120 |
  121 |     const card = page.locator('[data-testid="product-card"]').first();
  122 |     await card.hover();
  123 |     const heartBtn = card.locator('[data-testid="wishlist-btn"]');
  124 |
  125 |     // Double click rapidly
  126 |     await heartBtn.click();
  127 |     await heartBtn.click();
  128 |     await page.waitForTimeout(1000);
  129 |
  130 |     expect(apiCalls.length).toBe(1); // only 1 API call despite 2 clicks
  131 |     console.log(`✅ API called ${apiCalls.length} time(s) — double-click blocked`);
  132 |   });
  133 |
  134 |   // ── Case 5: Wishlist drawer shows correct items ────────────────────────────
  135 |   test("✅ Case 5: Wishlist drawer opens and shows added item", async ({ page }) => {
  136 |     // Add a product
  137 |     const card = page.locator('[data-testid="product-card"]').first();
  138 |     const productName = await card.locator('[data-testid="product-name"]').textContent();
  139 |     await card.hover();
  140 |     await card.locator('[data-testid="wishlist-btn"]').click();
```
