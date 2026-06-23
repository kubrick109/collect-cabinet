# Collect Cabinet

A polished personal collection manager for anime merchandise, figures, cards, badges, acrylic stands, plush, and more.

Collect Cabinet lets collectors organize items into themed rooms, track estimated values, upload photos, search their collection, and keep local backups—all through a responsive display-cabinet interface.

## Features

- Create custom collection rooms with gold, rose, blue, or green themes
- Add collectible photos, names, series, characters, categories, values, and notes
- Browse items in display-case or list layouts
- Search, filter, and sort each room
- View room totals and category breakdowns
- Register separate local accounts with isolated collection data
- Mark rooms and collectibles as public or private
- Export and import JSON backups
- Preview an experimental virtual-figure workflow
- Use the interface on desktop and mobile

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Browser `localStorage`

## Run Locally

```bash
git clone https://github.com/YOUR-USERNAME/collect-cabinet.git
cd collect-cabinet
npm install
npm run dev
```

Open the local address shown in the terminal, usually `http://localhost:5173`.

## Quality Checks

```bash
npm run lint
npm run build
```

## Publish an Update

On Windows, double-click `publish-update.bat` after finishing a change.

The publishing assistant will:

1. Run lint and a production build.
2. Ask for a short update description.
3. Show every file that will be included.
4. Create a Git commit.
5. Push `main` to GitHub.
6. Trigger the GitHub Pages deployment automatically.

It can also be run from a terminal:

```bash
npm run publish:update
```

If automatic authentication is unavailable, the assistant opens GitHub Desktop so the final **Push origin** can be completed there.

## Data and Privacy

This is currently a front-end MVP. Accounts, collection data, and compressed images are stored only in the current browser. Export JSON backups regularly if you use it for a real collection.

The local authentication flow is for demonstration and development—it is not suitable for storing sensitive passwords on a public production site. A hosted release should replace it with a real authentication and database service.

## Roadmap

- Cloud authentication and database storage
- Shareable public collection pages
- Real image recognition
- Market-price integrations
- Full 3D collectible generation and viewing

## License

No license has been selected yet. All rights reserved by the project owner.
