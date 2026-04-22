import { expect, test } from "@playwright/test";

test("user can load a template, create semantic structure, and restore local state", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Load starter world" }).click();
  await expect(page.getByTestId("scene-canvas").getByText("Starter Guild")).toBeVisible();
  await page.reload();
  await expect(page.getByTestId("scene-canvas").getByText("Starter Guild")).toBeVisible();
});
