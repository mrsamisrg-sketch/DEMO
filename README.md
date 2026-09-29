# QGE Rates Portal

An internal rate portal for the **sales team** — every company, every product, every model, with
**Cash rate**, **Installment rate** and (for **Haier**) a **Fix rate**, month by month.
Rates are published from GitHub only, so the whole team always sees the latest updated month.

Theme: **Red · White · Black**. Access is protected by username & password.

---

## 1. Login

| Field | Value |
| --- | --- |
| Username | `QGE@1983` |
| Password | `QGE@1122` |

The session is remembered on the device until the salesman signs out.
To change the credentials, edit the two constants at the top of `src/components/Login.tsx`.

---

## 2. How to update the rates every month (GitHub only — no upload button on the site)

1. Open the master sheet `data/rates.xlsx` (Excel) and add/replace the rows for the new month.
2. On GitHub open the repository → **`data`** folder → **Add file → Upload files**.
3. Drag your updated **`rates.xlsx`** into it (keep the file name exactly `rates.xlsx`) → **Commit changes**.
4. That's all. The GitHub Action (`update-rates.yml`) converts the Excel sheet to app data,
   commits `public/data/rates.json` + `src/data/rates.ts`, builds the site and republishes it.
   Salesmen see the new month within a minute or two.

> Prefer CSV? Upload **`rates.csv`** instead — the converter accepts either.
> `data/rates-template.csv` shows the exact format.

Run it locally if you want to preview first:

```bash
npm install
node scripts/excel-to-json.mjs   # data/rates.xlsx → src/data/rates.ts + public/data/rates.json
npm run dev
```

### Sheet columns (header row required)

| Column | Required | Example | Notes |
| --- | --- | --- | --- |
| `company` | ✅ | `Haier` | Shown as the card heading / filter |
| `product` | ✅ | `Air Conditioner` | Second dropdown filter |
| `model` | ✅ | `HSU-18HFCF Inverter 1.5 Ton` | Searched by model number |
| `cash` | ✅ | `142500` | Cash / full payment price |
| `installment` | ✅ | `156750` | Installment plan price (if blank → cash + 10%) |
| `fix` | optional | `149600` | **Haier only** — third rate plan |
| `remarks` | optional | `Free installation kit` | Card shows a note **only when filled**; blank = nothing displayed |
| `stock` | optional | `Low Stock` / `Out of Stock` / `Available` | Small badge on the card |
| `month` | ✅ | `2` or `Feb` or `February 2026` | Rate month |
| `year` | ✅ | `2026` | Rate year |

Keep previous months in the sheet — the portal uses them for the **month selector**, the
**month-over-month price change** arrows and the **price history** chart.

---

## 3. Features for the salesman

- Search bar directly under the header — company, product, model no. or remark (press `/` to focus).
- Two filters in one line: **COMPANY** and **PRODUCT**.
- Sticky compact header that **slides away on scroll down** and returns on scroll up.
- Month / year selector with a **NEW** badge on the latest published month.
- Rate tiles: Cash (black), Installment (red) + markup %, **Fix rate** (dashed) for Haier.
- Automatic ▲/▼ change vs last month on every tile.
- **Remarks** appear on the card only when the sheet has a remark for that model.
- Stock badge (Out of stock / Low stock).
- ⭐ Favourites, 📋 copy rate details, WhatsApp share, 📈 price history chart per model.
- Export the filtered list to Excel/CSV, or print a clean rate list.
- Works offline — the last downloaded rate sheet is cached on the device.

---

## 4. Deployment (GitHub Pages)

1. Push this repository to GitHub (branch `main`).
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Every push to `data/**` rebuilds and republishes the portal automatically.

## 5. Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in /dist
```

## 6. Security notes

- The portal is for internal use. Keep the repository **private** (GitHub Pages on a private repo
  requires a paid plan; otherwise restrict access at your own policy level).
- Change the demo username/password before sharing with the team.
- Rates are confidential — the login screen reminds every user of it.

---

© QGE Distribution — Confidential, internal use only.
