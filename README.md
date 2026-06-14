# GreazeMike

My Portfolio Website.

Projects are managed through a self-serve admin panel — no code edits needed to
add, edit, or remove a project. Data lives in [Supabase](https://supabase.com)
(free tier).

## How it works

- `index.html` loads projects from Supabase and renders the cards (`js/projects.js`).
- `admin.html` is a password-protected panel to add / edit / delete projects and
  upload images (`js/admin.js`).
- `js/config.js` holds your Supabase URL + public key.
- Row Level Security in Supabase means only **you** (logged in) can change data;
  the public can only read it.

## One-time setup (~10 min)

### 1. Create a Supabase project
- Go to https://supabase.com → sign up → **New Project**.
- Pick a name + database password, wait for it to provision.

### 2. Create the database table + storage
- In the project: **SQL Editor** → **New query**.
- Paste the contents of `supabase-setup.sql` → **Run**.
- This creates the `projects` table, the `project-images` storage bucket,
  security policies, and seeds your existing 4 projects.

### 3. Create your admin login
- **Authentication** → **Users** → **Add user** → **Create new user**.
- Enter your email + a strong password. (Tick "Auto Confirm User" if shown.)
- This email/password is what you'll use at `admin.html`.

### 4. Wire up your keys
- **Project Settings** → **API**.
- Copy **Project URL** and the **anon public** key.
- Open `js/config.js` and paste them into `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
- These are safe to commit — the anon key is public by design; security is
  enforced by the database policies, not by hiding the key.

### 5. Deploy
- Push to your Vercel project as usual. Done.

## Daily use

- Go to `https://yoursite.com/admin.html`.
- Log in with the email/password from step 3.
- **Add Project**: fill the form, upload an image, Save. It appears on the site
  immediately on next page load.
- **Edit / Delete**: use the buttons in the "Existing Projects" list.
- **Order**: lower "Sort Order" numbers show first.

> Tip: the seeded projects have no images yet (the old ones were local files).
> Edit each one in the admin panel and upload its image so it's stored in Supabase.

## Local dev

```bash
npm install
npm run dev   # vercel dev
```

The contact form (`api/send-email.js`) uses Resend and needs `RESEND_API_KEY`
set in your Vercel environment.
