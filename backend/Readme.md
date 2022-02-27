# Getting Started with Create React App

Express and Node.js Server using TypeScript.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the server.\
Open [http://localhost:8000](http://localhost:3000) to ping it.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run fix`

Launches the linter configured using [ESLint](https://eslint.org/docs/user-guide/command-line-interface).

### `npm build`

Compiles the TypeScript into JavaScript. Do this before deploying code anywhere.

## Deployment

* Checkout to the `heroku-deployment` branch or create it if you don't have it locally.
* Make sure this branch does not have `backend/build` in the gitignore (or change it as needed).
* Build the backend locally.
* Commit any changes
* Deploy the branch using `git push heroku heroku-development:main`.

This is required because there's something weird going on related to typescript and building projects in the heroku instance, so the temporary workaround is just to build it locally and push that commit.
