This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## GitHub, Vercel and Supabase Setup

This repository is ready to push to GitHub and deploy on Vercel. The project also includes a Supabase integration scaffold in `src/lib/supabaseClient.ts` and a database schema in `supabase/schema.sql`.

### What is ready

- Local git repository initialized in `app/`
- `npm run build` works
- Supabase client scaffolding added
- `.env.example` created with Supabase env vars
- Dashboard pages and mobile menu fixed

### What still needs to happen

1. Create a GitHub repo for this project, for example `allan272/cucu-mutugi`.
2. Add the remote and push from `app/`:

```bash
cd "C:\Users\HP\Documents\CUCU MUTUGI\app"
git remote add origin https://github.com/allan272/cucu-mutugi.git
git push -u origin main
```

3. Create a Vercel project and connect it to the GitHub repo.
4. Add these environment variables to Vercel:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

5. Create Supabase tables using `supabase/schema.sql`.

## Android Mobile App Workflow

### Testing New Features (Dev / Vercel Preview)
Before testing new features against a Vercel Preview URL:
1. Update `capacitor.config.dev.ts` with your current Vercel preview URL (replace `PASTE_PREVIEW_URL_HERE`).
2. Run `npm run mobile:use-dev` (copies dev config into `capacitor.config.ts`).
3. Run `npx cap sync android` to apply changes to the native project.
4. Rebuild / launch in Android Studio.

### Release Builds (Production)
Before a release build pointing to live production (`https://www.cucumutugi.com`):
1. Run `npm run mobile:use-prod` (copies prod config into `capacitor.config.ts`).
2. Run `npx cap sync android`.
3. Build release APK / AAB in Android Studio.