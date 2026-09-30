# QGE Rates Portal

**Qaiser Group of Electronics — Salesman Rates Portal**

A private single-page website where the sales team can quickly look up the latest **Cash** and **Installment** rates (plus **Fixed** rate for **Haier**) for every product, model and company. Rates are updated once a month by dropping a new `rates.xlsx` into the GitHub repository — no code changes needed.

---

## Live features

- 🔐 **Login protected** — Username: `QGE@1983` · Password: `QGE@1122`
- 📊 **Excel-driven** — reads `rates.xlsx` from the same folder
- 🔴⚫⚪ **Red / White / Black** theme, aesthetic and mobile-friendly
- 🧠 **Fuzzy search** — ignores spaces, dashes, underscores. `led 43` finds `LED-43UHD`
- 🎛️ **Two overlay dropdowns** — Company + Product (dependent). Dropdowns open as overlays, no new screens.
- 📌 **Auto-hide slim header** on scroll down
- 🏷️ **Special Haier cards** show 3 rates (Cash · Installment · Fixed); every other brand shows 2 (Cash · Installment)
- 📝 Optional **remarks** column shown on the card only if present
- 📅 Each card shows **Month & Year** of the rate

---

## How to update rates every month

1. Open your `rates.xlsx` locally in Excel/Google Sheets.
2. Edit the values, add/remove rows.
3. Commit and push the updated `rates.xlsx` to this GitHub repository (same folder as `index.html`).
4. Done — the site instantly serves the new file (users may need to click **Refresh** in the header).

### Expected columns

Column headers are matched case-insensitively and ignore spaces/underscores. Any of these headings work:

| Field         | Accepted headings                                        | Required |
| ------------- | -------------------------------------------------------- | -------- |
| Company       | `Company`, `Brand`, `Make`                               | ✅ Yes    |
| Product       | `Product`, `Category`, `Type`                            | Optional |
| Model         | `Model`, `Model No`, `Model Name`                        | ✅ Yes    |
| Cash          | `Cash`, `Cash Rate`, `Cash Price`                        | Optional |
| Installment   | `Installment`, `EMI`, `Qist`, `Installment Rate`         | Optional |
| Fixed (Haier) | `Fixed`, `Fix`, `Fixed Rate`, `Fix Rate`                 | Optional |
| Remarks       | `Remarks`, `Remark`, `Note`, `Comment`                   | Optional |
| Month         | `Month`                                                  | Optional |
| Year          | `Year`                                                   | Optional |

Only rows with a **Company** and **Model** are imported. Empty price cells are shown as `—`.

### Example row

| Company | Product | Model      | Cash  | Installment | Fixed | Remarks       | Month   | Year |
| ------- | ------- | ---------- | ----- | ----------- | ----- | ------------- | ------- | ---- |
| Haier   | LED TV  | H43K6UG    | 78500 | 92000       | 85000 | 4K UHD        | January | 2026 |
| Samsung | LED TV  | UA43CU7000 | 89000 | 108000      |       | Crystal UHD   | January | 2026 |

> The **Fixed** column is only meaningful for **Haier**; it is ignored for other companies.

---

## Deploying to GitHub Pages

1. Create a new GitHub repository (or use an existing one).
2. Upload two files to the repo root:
   - `index.html` (built version — the whole app is bundled into this single file)
   - `rates.xlsx` (your monthly rate sheet)
3. In the repo **Settings → Pages** enable Pages from the `main` branch, root folder.
4. Open the provided URL. The salesmen just bookmark it.

That’s it — future updates only require replacing `rates.xlsx`.

---

## Building locally (only needed if you change the code)

```bash
npm install
npm run build
```

The built site is a single self-contained file at `dist/index.html`. Copy it to your GitHub repo alongside `rates.xlsx`.
