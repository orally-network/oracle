# Orally

On-chain oracle for EVM-based blockchains.

## Getting Started

You should create .env file in the root folder with keys needed for production.

Install all needed packages

### IC SDK

[IC SDK](https://internetcomputer.org/docs/current/developer-docs/setup/install/) should be installed on your machine.
The DFINITY command-line execution environment (dfx) is the primary tool for creating, deploying, and managing the dapps for the Internet Computer platform.

`sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`

In the project directory, you should run:
1 tab in the terminal: `dfx start`
2 tab in the terminal: `dfx canister create --all`

After that you script in the first tab could be stopped.

### `npm i` or `npm run install`

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:8080/](http://localhost:8080/) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
