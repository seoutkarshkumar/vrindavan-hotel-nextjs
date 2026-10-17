# 🏨 Vrindavan Hotel Website & Zero-Code Admin Panel – Hinglish Guide (Step-by-Step)

**Radhe Radhe!** 🙏  
Yeh guide bilkul simple **Hinglish (Hindi in English letters)** mein likhi gayi hai taaki bina kisi coding knowledge ke aap apni hotel website chala sakein, rooms aur pages edit kar sakein, aur Google par #1 rank laa sakein.

---

## ⚠️ SABSE BADI GALTI: `dist` Folder Hostinger / cPanel Pe Upload MAT Karein

Agar aapne `dist` folder File Manager mein upload kiya aur **kuch nahi dikh raha / blank page** aa raha hai — yeh **normal** hai. Website toot nahi gayi.

**Kyun nahi dikhta?**

- Purana `dist` sirf ek khali React box hai (`<div id="root"></div>`). Photos, rooms, admin, booking — sabke liye **Node.js server + database** chahiye.
- Nayi website **Next.js** ki hai. Iska koi `dist` folder hota hi nahi. Iska build folder `.next` hota hai, aur yeh **Vercel** ya **Hostinger VPS / Node.js** par chalati hai.
- FileZilla / File Manager se `public_html` mein ZIP daalne se Home, Rooms, Admin, Sitemap **kabhi nahi** khulenge.

**Sahi tarika (2 options):**

1. **Hostinger Shared (aapka plan):** Niche **Section 2.5** padhein. Domain Hostinger pe rahega, website **Vercel (free)** pe chalegi. Email Hostinger pe hi chalega.
2. **Hostinger VPS (alag paid plan):** Tabhi poora project server par `npm run start` se chalta hai. Shared pe yeh option nahi hai.

---

## 🏠 2.5 Hostinger Shared Hosting — Bilkul Sahi Setup (File Manager Nahi)

**Seedha jawab:** Hostinger **Shared** hosting PHP / WordPress ke liye hai. Is hotel website ko Node.js + database chahiye, isliye `public_html` mein `dist` upload karke **kabhi nahi** khulegi.

**Jo kaam karega (free, 20 minute):**
- Domain + email = Hostinger pe rehne do
- Website + Admin panel = Vercel pe (free)
- Hostinger DNS mein 2 lines badalni hain, bas

### Step 1 — File Manager se `dist` hatao (warna blank page rahega)

1. Hostinger **hPanel** kholo → **Files** → **File Manager**
2. `public_html` folder kholo
3. Jo `dist` / `index.html` / `assets` aapne upload kiye the, unhe **Delete** kar do (ya ek folder `old-backup` mein shift kar do)
4. `public_html` ko practically empty chhod do. Website yahan se nahi chalni hai.

### Step 2 — GitHub pe project daalo

1. [github.com](https://github.com) pe free account banao
2. **New repository** → naam: `vrindavan-hotel` → **Private** → Create
3. Apne computer par project folder mein yeh commands chalao (GitHub username apna likho):

```bash
git init
git add .
git commit -m "Vrindavan hotel website"
git branch -M main
git remote add origin https://github.com/APNA-USERNAME/vrindavan-hotel.git
git push -u origin main
```

### Step 3 — Free database (Supabase) — Hostinger pe SQLite nahi chalega live

1. [supabase.com](https://supabase.com) → Sign up → **New Project**
2. Project name: `vrindavan-hotel` → ek strong password save kar lo
3. Project ready hone ke baad **Project Settings** → **Database** → **Connection string** → **URI** copy karo
4. Computer par `prisma/schema.prisma` file kholo, line 9 yeh karo:

```
provider = "postgresql"
```

(`sqlite` hatao, `postgresql` likho — Vercel pe PostgreSQL chahiye)

5. `.env` mein:

```
DATABASE_URL="YAHAN_SUPABASE_URI_PASTE_KARO"
```

6. Computer par ek baar chalao:

```bash
npx prisma db push
npx prisma db seed
```

(Agar seed error aaye to: `node prisma/seed.js`)

### Step 4 — Vercel pe website live karo (free)

1. [vercel.com](https://vercel.com) → **Continue with GitHub**
2. **Add New** → **Project** → `vrindavan-hotel` select → Import
3. **Environment Variables** mein yeh 5 cheezein add karo:

| Name | Value |
|---|---|
| `DATABASE_URL` | Supabase wala URI (wahi jo Step 3 mein copy kiya) |
| `JWT_SECRET` | koi lamba secret jaise `merahotelvrindavan2026secretkey` |
| `ADMIN_EMAIL` | `admin@vrindavanhotel.com` |
| `ADMIN_DEFAULT_PASSWORD` | `Vrindavan@123` |
| `NEXT_PUBLIC_SITE_URL` | `https://aapka-domain.com` (https ke saath) |

4. **Deploy** dabao. 2 minute mein Vercel ek link dega jaise `https://vrindavan-hotel.vercel.app` — pehle yahi khol ke check karo ki Home / Rooms dikh rahe hain.

### Step 5 — Hostinger domain ko Vercel se jodo (email nahi toote)

**Nameserver mat badalna.** Sirf 2 DNS records.

1. Vercel → apna project → **Settings** → **Domains** → apna domain type karo (`aapka-domain.com`) → Add
2. Hostinger hPanel → **Domains** → apna domain → **DNS / DNS Zone Editor**
3. Yeh 2 records set karo (purana A record jo Hostinger IP pe hai, usko edit/delete karo):

| Type | Name | Points to / Value | TTL |
|---|---|---|---|
| **A** | `@` | `76.76.21.21` | 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 |

4. **MX records mat chhedna** — Hostinger email isi se chalta hai
5. 10–60 minute wait. Phir `https://aapka-domain.com` kholo — lock (HTTPS) Vercel khud laga dega
6. Login: `https://aapka-domain.com/admin/`  
   Email: `admin@vrindavanhotel.com`  
   Password: `Vrindavan@123`  
   Pehle **Password & Backup** se password badal lo

### Hostinger Shared pe yeh mat sochna

- `public_html` mein ZIP / `dist` / `.next` folder daalna
- Softaculous se WordPress laga ke is project ko mix karna
- Shared hosting ka **PHP** button is site ke liye

Agar hPanel mein **VPS** ya **Node.js** menu dikhe, tab alag baat hai — woh Shared nahi, Cloud/VPS hai. Shared plan pe Vercel + DNS hi sahi rasta hai.

---

## 📖 1. Technical Words Ka Easy 1-Line Matlab (Dictionary)

- **SSR (Server-Side Rendering)**: Jab koi guest ya Google aapki website kholta hai, server poora HTML page tayyar karke bhejta hai taaki Google aur ChatGPT sab kuch turant padh sakein.
- **Canonical URL**: Har page ka "Asli Official Link" jo automatically set hota hai taaki Google duplicate links se confuse na ho.
- **301 Redirect**: Jab aap kisi page ka URL link badalte hain, purane link par aane wale log automatically naye link par pahunch jaate hain.
- **Sitemap (`/sitemap.xml`)**: Aapki website ke saare pages ki automatic list jo Google ko batati hai ki kaun-kaun se pages live hain.
- **Robots.txt (`/robots.txt`)**: Website ke gatekeeper ka rule-board jo Google, Bing aur AI bots (GPTBot, ClaudeBot, PerplexityBot) ko andar aane deta hai aur `/admin` ko chhupaata hai.
- **LLMs.txt (`/llms.txt`)**: ChatGPT, Perplexity aur Claude jaise AI tools ke liye aapke hotel ka short summary card.
- **JSON-LD Schema**: Google ke liye chhupa hua code jisse Google Search mein aapke FAQs, Room Prices, aur Hotel Address chamakte hain (Rich Results).
- **WebP Image**: Photo ka naya fast format jisse photo ka size 70% chhota ho jaata hai aur website superfast khulti hai.

---

## 💻 2. (a) Apne Computer Par Website Kaise Chalayein (Run Locally)

Agar aap apne computer/laptop par test karna chahte hain:

1. **Node.js Install Karein**: Agar pehle se nahi hai, toh [nodejs.org](https://nodejs.org) se "LTS" version download karke install karein.
2. **Project Folder Kholein**: Terminal ya Command Prompt mein is project folder ke andar aayein.
3. **Packages Install Karein** (Sirf pehli baar):
   ```bash
   npm install
   ```
4. **Database aur Default Hotel Data Setup Karein** (Sirf pehli baar):
   ```bash
   npm run db:setup
   ```
5. **Website Start Karein**:
   ```bash
   npm run dev
   ```
6. Ab apne browser (Chrome) mein kholein:
   - **Public Website**: `http://localhost:3000/`
   - **Admin Panel**: `http://localhost:3000/admin/`

---

## ☁️ 3. (b) Vercel Par Free Database (Supabase) Ke Saath Live Deploy Kaise Karein

Website ko duniya bhar mein 24×7 live rakhne ke liye hum **Supabase (Free Postgres Database)** aur **Vercel (Free Fast Hosting)** use karenge:

### Step A: Free Database Banayein (Supabase.com)
1. [supabase.com](https://supabase.com) par jaakar free account banayein aur **"New Project"** par click karein.
2. Project ka naam rakhein `vrindavan-hotel` aur ek strong Database Password rakhein.
3. Project banne ke baad upar **"Connect"** button dabayein → **"ORMs"** tab mein **Prisma** select karein aur `DATABASE_URL` copy kar lein.
4. *(Important)* Jab aap Vercel par Postgres use karein, toh `prisma/schema.prisma` file mein line 9 par `provider = "sqlite"` ko badal kar `provider = "postgresql"` kar dein.

### Step B: GitHub & Vercel Par Upload Karein
1. [github.com](https://github.com) par free account banakar is project ko ek Private Repository mein upload karein.
2. [vercel.com](https://vercel.com) par jaakar **"Continue with GitHub"** se login karein.
3. **"Add New Project"** → Apna `vrindavan-hotel` GitHub project select karein.
4. **"Environment Variables"** section mein yeh 4 cheezein daalein:
   - `DATABASE_URL` = *(Aapka Supabase wala link)*
   - `JWT_SECRET` = *(Koi bhi lamba secret password jaise `meravrindavanhotel2026secret`)*
   - `ADMIN_EMAIL` = `admin@vrindavanhotel.com`
   - `ADMIN_DEFAULT_PASSWORD` = `Vrindavan@123`
   - `NEXT_PUBLIC_SITE_URL` = `https://vrindavanhotel.com` *(Aapka final domain)*
5. **"Deploy"** button dabayein! 2 minute mein aapki website live ho jayegi!

---

## 🌐 4. (c) Apna Custom Domain (`vrindavanhotel.com`) Kaise Connect Karein (With Free HTTPS)

1. Vercel Dashboard mein apne project ke andar **"Settings"** → **"Domains"** par click karein.
2. Apna domain naam (jaise `vrindavanhotel.com`) type karke **"Add"** dabayein.
3. Vercel aapko **2 DNS Records** dikhayega:
   - **A Record**: Name `@` → Value `76.76.21.21`
   - **CNAME Record**: Name `www` → Value `cname.vercel-dns.com`
4. Jahan se aapne domain kharida hai (GoDaddy, Hostinger, ya Namecheap), wahan **"DNS Management"** mein jaakar yeh A Record aur CNAME Record save kar dein.
5. 10–30 minute mein Vercel automatically **Free SSL / HTTPS (Green Lock 🔒)** chalu kar dega aur `www` ko automatically `non-www` par redirect kar dega!

---

## 🔐 5. (d) Pehli Baar `/admin` Mein Login Kaise Karein AurHotel Details Kaise Bharein

1. Apni website ke aage `/admin/` lagakar kholein (jaise `https://vrindavanhotel.com/admin/`).
2. Default Login Details daalein:
   - **Email**: `admin@vrindavanhotel.com`
   - **Password**: `Vrindavan@123`
3. **Sabse Pehla Kaam (Security)**: Left menu mein **"9. Password & Backup"** par click karein aur apna naya strong password set kar lein.
4. **Hotel Details Bharein**: Left menu mein **"6. Hotel & SEO Settings"** par click karein. Yahan `[naam]`, `[full address]`, `[number]`, `[email]`, aur `[e.g. 600 m]` ki jagah apne hotel ka asli naam, phone number, WhatsApp number aur Banke Bihari Mandir se distance bhar kar **"Save All Hotel & SEO Settings"** daba dein!
5. **Room Tariffs Bharein**: Left menu mein **"3. Rooms & Prices"** par click karein aur Deluxe, Family, aur Suite room ke asli rate (`₹__` ki jagah jaise `₹2,499` aur numeric `2499`) save kar dein.

---

## 📝 6. (e) Naya Page Ya Blog Kaise Banayein, SEO & FAQs Set Karke Publish Karein

1. Admin Panel mein **"2. Pages & Locations"** (ya **"4. Blog Manager"**) par click karein.
2. **"+ Add Standard Page"** (ya **"+ Add Location Page"**) button dabayein.
3. **Page Title (H1)** likhein (jaise: `Best Hotel Near Nidhivan Vrindavan`).
   - *Jaadu*: Jaise hi aap title likhenge, **URL Slug** aur **Self-Referencing Canonical URL** apne aap ban jayega aur Lock rahega!
4. **Visual Word-Like Editor** mein upar diye buttons (`Heading 2`, `Paragraph`, `Bold`, `List`, `Table`, `Photo`) daba kar bilkul MS Word ki tarah apna content likhein.
5. **FAQs Jodein**: Neeche **"Page FAQs"** section mein **"+ Add Question"** par click karke 3–4 Sawaal aur Jawaab likhein. Isse Google par aapka FAQ Schema apne aap ban jayega!
6. **SEO Fields & Live Score Dekhein**:
   - **Focus Keyword** mein mukhya keyword likhein (jaise `Hotel near Nidhivan Vrindavan`).
   - **SEO Title** (60 characters ke andar) aur **Meta Description** (155 characters ke andar) likhein.
   - Right side mein **Live SEO Score** box dekhein — jab saare points **Green ✓** ho jayein (Score 100/100), tab **"Save & Publish Page"** daba dein!

---

## 🔍 7. (f) Google Search Console Mein Sitemap Kaise Submit Karein & Google Business Profile Jodein

### Part 1: Google Search Console Setup & Sitemap Submit
1. [search.google.com/search-console](https://search.google.com/search-console) par apne Gmail se login karein.
2. **"URL Prefix"** box mein apna domain daalein (`https://vrindavanhotel.com`) aur **"HTML Tag"** verification code copy karein.
3. Apne Hotel Admin Panel → **"6. Hotel & SEO Settings"** → **"Google Search Console Verification Code"** box mein woh code paste karke Save karein.
4. Wapas Search Console mein **"Verify"** dabayein.
5. Left menu mein **"Sitemaps"** par click karein → `sitemap.xml` type karein → **"Submit"** daba dein!
6. Ab jab bhi aap Admin mein naya page banayenge, **"Request Indexing"** button daba kar uska link Search Console mein paste karein taaki Google usi din page ko rank kar de.

### Part 2: Google Business Profile (Google Maps) Link Jodein
1. Apne hotel ke Google Maps listing (Google Business Profile) ka share link copy karein.
2. Admin Panel → **"6. Hotel & SEO Settings"** → **"Google Business Profile Link"** box mein paste karke Save kar dein.
3. Yeh link automatically aapke website ke Footer aur Google `LocalBusiness` JSON-LD Schema (`sameAs`) mein jud jayega!

---

## ✅ 8. Owner Test Checklist (Khud Check Karne Ke 4 Easy Steps)

1. **Test 1: Naya Page Sitemap Mein Aata Hai Ya Nahi?**
   - Admin mein ek naya page publish karein → Browser mein `/sitemap.xml` kholein → Aapka naya page `<loc>` aur `<lastmod>` ke saath turant dikhega. Agar page ko `Draft` ya `noindex` karenge toh woh `/sitemap.xml` se apne aap hat jayega!
2. **Test 2: Canonical URL Khud Ke URL Ke Barabar Hai?**
   - Kisi bhi page (jaise `/rooms/deluxe-room/`) par Right-Click karein → **"View Page Source"** dabayein → `<link rel="canonical"` dhoondein → Woh bilkul usi page ka `https://.../rooms/deluxe-room/` dikhayega.
3. **Test 3: Google Rich Results Test Mein FAQ & Hotel Schema Dikhta Hai?**
   - [search.google.com/test/rich-results](https://search.google.com/test/rich-results) kholein → Apne page ka URL ya HTML code paste karein → Aapko **Hotel**, **LocalBusiness**, **FAQPage**, aur **BreadcrumbList** green tick ke saath dikhenge!
4. **Test 4: Mobile Responsive Check (360px, 768px, 1280px)**
   - Apne mobile phone par website kholein → Neeche **Sticky Call Hotel** aur **WhatsApp (Save 10%)** button har page par chipke hue milenge aur saare forms bina zoom kiye aaraam se bhare jayenge.
