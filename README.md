# Check Pink

Storefront for Check Pink, a small-batch womenswear label. React front end and Node.js API in one Next.js app, deployable to Vercel as a single project.

## Run it

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000, reloads as you edit
```

For a production build: `npm run build`, then `npm run start`. If port 3000 is taken, add a port: `npm run dev -- -p 3210`.

## Where things are

| Path | What it holds |
| --- | --- |
| `src/lib/catalog.ts` | Brand details, categories, occasions ("plans") and every product. Edit this to change what the shop sells. |
| `src/app/` | Pages (`/`, `/shop`, `/product/[id]`, `/story`, `/checkout`) and the API under `src/app/api/`. |
| `src/app/globals.css` | All styling, driven by the colour and type tokens at the top. |
| `src/components/` | React components. Files starting with `"use client"` run in the browser; the rest render on the server. |
| `src/lib/shop-context.tsx` | Bag, saved pieces, open panels and toasts. The bag is kept in the browser's localStorage. |
| `src/server/` | Backend logic: request validation, pricing, order creation, storage. |
| `public/img/` | Photos. These are stock placeholders; replace them with real product photography. |

## API

All routes run on Node.js and answer JSON. Errors look like `{ "error": { "code", "message", "fields"? } }`.

| Route | Purpose |
| --- | --- |
| `GET /api/health` | Is the API up, and which storage is active. |
| `GET /api/products` | Catalogue. Filters: `q`, `cat`, `plan`, `size`, `stock=1`, `drop=1`, `sort`. |
| `GET /api/products/:id` | One product. |
| `POST /api/cart/price` | Prices a bag on the server: lines, shipping, total, and any lines that can't be bought. |
| `POST /api/orders` | Places a cash-on-delivery order. |
| `POST /api/subscribers` | Drop-alert email sign-up. |
| `POST /api/messages` | Contact form. |

Prices, stock and shipping are always worked out on the server from `catalog.ts`; anything the browser sends about price is ignored.

## Storage

`src/server/storage.ts` is the only file that reads or writes saved data.

- **On your machine** it writes JSON files to `.data/` (git-ignored), so orders, sign-ups and messages work with nothing to install.
- **On Vercel** there is no durable disk, so until a database is connected the three write routes answer `503` and the site tells the shopper the order or message was not saved. Browsing, search, the bag and price checks all work.

To go live, implement `insert` and `findOne` in `storage.ts` against a database and read its connection string from an environment variable.

## Not built yet

- A database (see above).
- Online payments. Checkout is cash on delivery only.
- Stock that goes down when an order is placed; stock levels are fixed values in `catalog.ts`.
- Order emails, an admin view of orders, accounts, and rate limiting on the forms.

## Deploy to Vercel

1. At vercel.com, choose **Add New → Project** and import this GitHub repository.
2. Leave every setting as it is. Vercel detects Next.js; there is no build command, output folder or environment variable to fill in.
3. Press **Deploy**.

After that, every push to `main` goes live automatically, and every other branch or pull request gets its own preview link.

To deploy from your machine instead: `npx vercel` for a preview, `npx vercel --prod` to publish.
