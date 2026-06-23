# Deployment

## GitHub Pages

This repository includes a GitHub Actions workflow that builds and deploys the site whenever the `main` branch is updated.

After pushing the repository to GitHub:

1. Open the repository's **Settings**.
2. Select **Pages**.
3. Set **Source** to **GitHub Actions**.
4. Open the **Actions** tab and wait for the deployment workflow to finish.

The published URL will usually follow this format:

```text
https://YOUR-USERNAME.github.io/collect-cabinet/
```

## Important Production Note

The current account system is a browser-only demonstration. Usernames, passwords, collection data, and compressed images are stored in `localStorage`.

Before turning this into a multi-user production service, replace the local account flow with a hosted authentication and database provider such as Supabase.

Suggested environment variables for a future cloud version:

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never expose a service-role key in browser code.

## Future Updates

After changing the website, double-click `publish-update.bat` in the project folder. It performs the local checks, commit, GitHub upload, and deployment trigger in one guided workflow.
