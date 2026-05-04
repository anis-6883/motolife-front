// tests/wishlist.spec.ts
import { test, expect, Page } from "@playwright/test";

// ─── Config ───────────────────────────────────────────────────────────────────
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const TEST_EMAIL = process.env.TEST_EMAIL || "testuser@example.com";
const TEST_PASSWORD = process.env.TEST_PASSWORD || "testpassword";

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function login(page: Page) {
  await page.goto(`${BASE_URL}`);
  await page.getByRole("button", { name: /login/i }).click();
  await page.getByPlaceholder(/email/i).fill(TEST_EMAIL);
  await page.getByPlaceholder(/password/i).fill(TEST_PASSWORD);
  await page.getByRole("button", { name: /^login$/i }).click();
  await page.waitForTimeout(1500); // wait for auth
}

async function getZustandWishlistState(page: Page): Promise<Record<string, boolean>> {
  return page.evaluate(() => {
    // Access Zustand store from window — works if store is exposed
    const store = (window as any).__wishlistStore?.getState?.();
    return store?.wishlistedIds ?? {};
  });
}

async function getProductCardHeartState(page: Page, nth = 0): Promise<"filled" | "empty" | "loading"> {
  const card = page.locator('[data-testid="product-card"]').nth(nth);
  const spinner = card.locator('[data-testid="wishlist-spinner"]');
  const filledHeart = card.locator('[data-testid="heart-filled"]');
  const emptyHeart = card.locator('[data-testid="heart-empty"]');

  if (await spinner.isVisible()) return "loading";
  if (await filledHeart.isVisible()) return "filled";
  return "empty";
}

// ─── Tests ────────────────────────────────────────────────────────────────────
test.describe("🧪 Wishlist Feature — Full QA Suite", () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto(`${BASE_URL}/products`);
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
  });

  // ── Case 1: Add to wishlist ────────────────────────────────────────────────
  test("✅ Case 1: Click heart → adds to wishlist, heart turns red", async ({ page }) => {
    const card = page.locator('[data-testid="product-card"]').first();

    // Hover to reveal wishlist button
    await card.hover();
    const heartBtn = card.locator('[data-testid="wishlist-btn"]');
    await heartBtn.waitFor({ state: "visible" });

    const beforeState = await getProductCardHeartState(page, 0);
    expect(beforeState).toBe("empty");

    await heartBtn.click();
    await page.waitForTimeout(500); // optimistic update

    const afterState = await getProductCardHeartState(page, 0);
    expect(afterState).toBe("filled");

    // Check toast
    await expect(page.locator("text=Added to wishlist")).toBeVisible({ timeout: 3000 });
  });

  // ── Case 2: Remove from wishlist ──────────────────────────────────────────
  test("✅ Case 2: Click red heart again → removes from wishlist", async ({ page }) => {
    const card = page.locator('[data-testid="product-card"]').first();
    await card.hover();
    const heartBtn = card.locator('[data-testid="wishlist-btn"]');

    // Add first
    await heartBtn.click();
    await page.waitForTimeout(800);
    expect(await getProductCardHeartState(page, 0)).toBe("filled");

    // Remove
    await heartBtn.click();
    await page.waitForTimeout(800);
    expect(await getProductCardHeartState(page, 0)).toBe("empty");

    await expect(page.locator("text=Removed from wishlist")).toBeVisible({ timeout: 3000 });
  });

  // ── Case 3: Same product in 2 sections syncs ──────────────────────────────
  test("✅ Case 3: Same product in 2 sections — heart syncs across both", async ({ page }) => {
    // Find a product ID that appears in multiple sections
    const allCards = page.locator('[data-testid="product-card"]');
    const firstProductId = await allCards.first().getAttribute("data-product-id");

    // Find second instance of the same product
    const duplicateCard = page.locator(`[data-product-id="${firstProductId}"]`).nth(1);
    const firstCard = page.locator(`[data-product-id="${firstProductId}"]`).first();

    // Click heart on first card
    await firstCard.hover();
    await firstCard.locator('[data-testid="wishlist-btn"]').click();
    await page.waitForTimeout(800);

    // Second card should also show filled heart without clicking
    const secondCardState = await duplicateCard.locator('[data-testid="heart-filled"]').isVisible();
    expect(secondCardState).toBe(true);

    console.log("✅ Cross-section sync works");
  });

  // ── Case 4: Double-click protection ───────────────────────────────────────
  test("✅ Case 4: Double-click → only fires API once", async ({ page }) => {
    const apiCalls: string[] = [];

    // Intercept wishlist API
    await page.route("**/wishlist**", (route) => {
      if (route.request().method() === "POST") {
        apiCalls.push(route.request().url());
      }
      route.continue();
    });

    const card = page.locator('[data-testid="product-card"]').first();
    await card.hover();
    const heartBtn = card.locator('[data-testid="wishlist-btn"]');

    // Double click rapidly
    await heartBtn.click();
    await heartBtn.click();
    await page.waitForTimeout(1000);

    expect(apiCalls.length).toBe(1); // only 1 API call despite 2 clicks
    console.log(`✅ API called ${apiCalls.length} time(s) — double-click blocked`);
  });

  // ── Case 5: Wishlist drawer shows correct items ────────────────────────────
  test("✅ Case 5: Wishlist drawer opens and shows added item", async ({ page }) => {
    // Add a product
    const card = page.locator('[data-testid="product-card"]').first();
    const productName = await card.locator('[data-testid="product-name"]').textContent();
    await card.hover();
    await card.locator('[data-testid="wishlist-btn"]').click();
    await page.waitForTimeout(1000);

    // Open wishlist drawer
    await page.locator('[data-testid="wishlist-drawer-trigger"]').click();
    await page.waitForSelector('[data-testid="wishlist-drawer"]', { timeout: 5000 });

    // Product should appear in drawer
    await expect(page.locator(`text=${productName?.trim()}`)).toBeVisible({ timeout: 5000 });
    console.log(`✅ "${productName}" visible in drawer`);
  });

  // ── Case 6: Remove from drawer → card heart unfills ───────────────────────
  test("✅ Case 6: Remove from drawer → product card heart unfills", async ({ page }) => {
    // Add product
    const card = page.locator('[data-testid="product-card"]').first();
    await card.hover();
    await card.locator('[data-testid="wishlist-btn"]').click();
    await page.waitForTimeout(1000);

    // Open drawer and remove
    await page.locator('[data-testid="wishlist-drawer-trigger"]').click();
    await page.waitForSelector('[data-testid="wishlist-drawer"]');
    await page.locator('[data-testid="wishlist-remove-btn"]').first().click();
    await page.waitForTimeout(1000);

    // Close drawer
    await page.locator('[data-testid="wishlist-drawer-close"]').click();
    await page.waitForTimeout(500);

    // Card heart should be empty now
    await card.hover();
    expect(await getProductCardHeartState(page, 0)).toBe("empty");
    console.log("✅ Heart unfilled after drawer removal");
  });

  // ── Case 7: Zustand store state check ─────────────────────────────────────
  test("✅ Case 7: Zustand wishlistedIds updates correctly after toggle", async ({ page }) => {
    // Expose store for testing — add this to your app in dev mode:
    // if (process.env.NODE_ENV === 'development') window.__wishlistStore = useWishlistStore
    const card = page.locator('[data-testid="product-card"]').first();
    const productId = await card.getAttribute("data-product-id");

    await card.hover();
    await card.locator('[data-testid="wishlist-btn"]').click();
    await page.waitForTimeout(1000);

    const state = await getZustandWishlistState(page);
    console.log("🟢 Zustand wishlistedIds after add:", state);

    if (productId && Object.keys(state).length > 0) {
      expect(state[productId]).toBe(true);
    } else {
      console.warn("⚠️ Store not exposed — skipping Zustand state assertion");
    }
  });

  // ── Case 8: Re-add after remove works correctly ────────────────────────────
  test("✅ Case 8: Add → Remove → Add again works (no duplicate DB entries)", async ({ page }) => {
    const card = page.locator('[data-testid="product-card"]').first();
    await card.hover();
    const heartBtn = card.locator('[data-testid="wishlist-btn"]');

    // Add
    await heartBtn.click();
    await page.waitForTimeout(800);
    expect(await getProductCardHeartState(page, 0)).toBe("filled");

    // Remove
    await heartBtn.click();
    await page.waitForTimeout(800);
    expect(await getProductCardHeartState(page, 0)).toBe("empty");

    // Re-add
    await heartBtn.click();
    await page.waitForTimeout(800);
    expect(await getProductCardHeartState(page, 0)).toBe("filled");

    console.log("✅ Add → Remove → Add cycle works");
  });

  // ── Case 9: Not logged in → heart button hidden ────────────────────────────
  test("✅ Case 9: Logged out user — wishlist button not shown", async ({ page }) => {
    // Logout
    await page.goto(`${BASE_URL}/api/auth/signout`);
    await page.goto(`${BASE_URL}/products`);
    await page.waitForSelector('[data-testid="product-card"]');

    const card = page.locator('[data-testid="product-card"]').first();
    await card.hover();

    const heartBtn = card.locator('[data-testid="wishlist-btn"]');
    await expect(heartBtn).not.toBeVisible();
    console.log("✅ Heart hidden for logged-out users");
  });

  // ── Case 10: Init loads correct wishlist state on page load ───────────────
  test("✅ Case 10: Page reload → wishlisted products still show filled heart", async ({ page }) => {
    // Add product
    const card = page.locator('[data-testid="product-card"]').first();
    const productId = await card.getAttribute("data-product-id");
    await card.hover();
    await card.locator('[data-testid="wishlist-btn"]').click();
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 10000 });
    await page.waitForTimeout(2000); // wait for init() to fetch

    // Heart should still be filled
    const reloadedCard = page.locator(`[data-product-id="${productId}"]`).first();
    await reloadedCard.hover();
    expect(await reloadedCard.locator('[data-testid="heart-filled"]').isVisible()).toBe(true);
    console.log("✅ Wishlist state persists after page reload");
  });
});
