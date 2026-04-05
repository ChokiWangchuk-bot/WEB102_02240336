# WEB102_02240336

This folder is your **module root** for WEB102 submissions. The runnable work lives in two places:

| Path | What it is |
|------|------------|
| **`social-media-api/`** | Node.js + Express REST API (Practical 2). Run `npm install` (once) and `npm start` from this folder. |
| **`web/`** | Static **web** front page (overview + how to run the API and open docs). Open `web/index.html` in a browser, or serve it any way you prefer. |

## Run the API

```bash
cd social-media-api
npm install   # if you have not already
npm start
```

Then in the browser:

- API root: `http://localhost:3000`
- API docs (HTML): `http://localhost:3000/api-docs`

Port comes from `social-media-api/.env` (`PORT`, default `3000`).
