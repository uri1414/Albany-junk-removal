# Albany Junk Removal

Website for **Albany Junk Removal** — fast, affordable, fully insured junk removal and cleanouts in Albany, Oregon and the Mid-Willamette Valley.

Live domain: [albanyjunkremoval.org](https://albanyjunkremoval.org)

## About

A single-page static site (no build step) focused on lead generation, with a
Netlify-powered free-quote form. Includes full SEO: keyword-led metadata,
Open Graph / Twitter cards, JSON-LD structured data (LocalBusiness, WebSite,
FAQPage), `robots.txt`, `sitemap.xml`, and `llms.txt`.

## Structure

```
index.html        # the whole site (HTML + CSS + JS inline)
assets/           # logo, favicons, social share image
robots.txt
sitemap.xml
llms.txt
netlify.toml      # static config, publishes the repo root
```

## Deploy (Netlify)

1. Netlify → **Add new site → Import from Git** → select this repo.
2. Build command: *(none)* · Publish directory: `.` (already set in `netlify.toml`).
3. Deploy, then add the custom domain `albanyjunkremoval.org` under
   **Domain management** and point your registrar's DNS at Netlify.
4. Under **Forms → notifications**, add an email notification to receive quote
   requests.

## To do before launch

- Replace placeholder contact details (phone, email) in `index.html`,
  `llms.txt`, and the JSON-LD block with the real business phone and email.
