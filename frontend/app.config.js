// Adds settings from the project's single .env (at the repo root) to app.json.
// Expo only reads a .env in frontend/, so this reads the root one instead, and
// passes ONLY public EXPO_PUBLIC_* values to the app. Backend secrets in the same
// file are never read here, so they can't end up in the app.
const fs = require('fs');
const path = require('path');

function publicEnv() {
  const file = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(file)) return {};
  const values = {};
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*(EXPO_PUBLIC_[A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (match) values[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  return values;
}

module.exports = ({ config }) => {
  const env = { ...publicEnv(), ...pickPublic(process.env) }; // the shell wins over the file
  return {
    ...config,
    extra: { ...config.extra, apiUrl: env.EXPO_PUBLIC_API_URL },
  };
};

function pickPublic(vars) {
  return Object.fromEntries(Object.entries(vars).filter(([key]) => key.startsWith('EXPO_PUBLIC_')));
}
