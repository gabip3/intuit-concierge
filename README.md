# Intuit Lifestyle Services

Static landing page for the Intuit employee benefit, powered by Atlanta Home
Concierge, plus the event prize wheel. Served by GitHub Pages at
**intuit.atlantahomeconcierge.com**.

## Pages

| Route | What it is |
|---|---|
| `/` | The Intuit benefit page: hero, quick actions, services, privileges, reviews, FAQ |
| `/wheel` | Event prize wheel. One spin per person, gated by name, phone, and email |
| `/wheel/draw` | End-of-day raffle draw, weighted by entries |

## How it relates to the main site

The main AHC site is a Next.js app with a server (client portal, admin
dashboard, leads API). GitHub Pages only serves static files, so this is a
standalone static export of the two public pages. Two consequences:

1. **Form submissions go through Web3Forms**, not the leads API. The concierge
   team receives each request by email and enters it into the CRM. The main
   site's `/api/leads/public` is unreachable from a static host.
2. **This is a copy.** The same pages also live in the main repo under
   `app/intuit/` and `app/wheel/`. Changing one does not change the other.

## Prize wheel data

Spins are stored in `localStorage` on the device running the wheel, and
emailed via Web3Forms as backup. The draw page reads from that same device,
so run the wheel and the draw on the **same tablet, same browser**, and do
not clear browsing data before the draw.

## Local development

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `out/`. Pushing to `main` triggers
the GitHub Actions workflow that builds and deploys it.

## Brand

Colors and type follow the AHC public marketing side: navy `#222B4A`, premium
gold `#CBA135`, brand green `#52A758`, Playfair Display headings, Inter body.
Icons are Phosphor Regular with the ahcGreen gradient (`#26C4D8` to `#6FC94D`).
