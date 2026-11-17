// Builds an installable Dr.Rock APK that opens the deployed web app.
//
//   node scripts/build-apk.mjs https://your-dr-rock.vercel.app
//
// The address is saved in capacitor.config.json, so later builds can omit it.
// Release signing uses these environment variables (never commit the keystore or passwords):
//   DR_ROCK_KEYSTORE, DR_ROCK_KEYSTORE_PASSWORD, DR_ROCK_KEY_ALIAS, DR_ROCK_KEY_PASSWORD
// Without them, a debug-signed APK is built instead (installable, for testing).
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const configPath = path.join(root, "capacitor.config.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));

function fail(message) {
  console.error(`\n✖ ${message}\n`);
  process.exit(1);
}

// 1. Server address.
const arg = process.argv[2];
if (arg) {
  let url;
  try {
    url = new URL(arg);
  } catch {
    fail(`"${arg}" is not a valid address. Example: https://dr-rock.vercel.app`);
  }
  if (url.protocol !== "https:") fail("The address must start with https:// (camera access requires a secure connection).");
  config.server.url = `${url.origin}/app`;
  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
}
const serverUrl = config.server?.url ?? "";
if (!serverUrl.startsWith("https://") || serverUrl.includes("REPLACE-WITH")) {
  fail("Pass the address of your deployed Dr.Rock, e.g.  node scripts/build-apk.mjs https://dr-rock.vercel.app");
}
console.log(`• App address: ${serverUrl}`);

// 2. Android SDK location.
const sdk = process.env.ANDROID_HOME ?? process.env.ANDROID_SDK_ROOT;
const localProps = path.join(root, "android", "local.properties");
if (sdk) writeFileSync(localProps, `sdk.dir=${sdk}\n`);
else if (!existsSync(localProps)) fail("Set ANDROID_HOME to your Android SDK folder.");

// 3. Copy web assets + config into the native project.
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, stdio: "inherit" });
run("npx", ["cap", "sync", "android"]);

// 4. Gradle build (signed release when a keystore is provided).
const { DR_ROCK_KEYSTORE: ks, DR_ROCK_KEYSTORE_PASSWORD: ksPass, DR_ROCK_KEY_ALIAS: alias, DR_ROCK_KEY_PASSWORD: keyPass } = process.env;
const release = Boolean(ks && ksPass && alias);
const gradle = process.env.GRADLE ?? (process.platform === "win32" ? "gradlew.bat" : "./gradlew");
const args = release
  ? [
      "assembleRelease",
      `-Pandroid.injected.signing.store.file=${path.resolve(ks)}`,
      `-Pandroid.injected.signing.store.password=${ksPass}`,
      `-Pandroid.injected.signing.key.alias=${alias}`,
      `-Pandroid.injected.signing.key.password=${keyPass ?? ksPass}`,
    ]
  : ["assembleDebug"];
if (!release) console.log("• No keystore configured: building a debug-signed APK.");
run(gradle, ["--no-daemon", "-q", ...args], path.join(root, "android"));

// 5. Collect the APK.
const variant = release ? "release" : "debug";
const built = path.join(root, "android", "app", "build", "outputs", "apk", variant, `app-${variant}.apk`);
if (!existsSync(built)) fail(`Gradle finished but ${built} was not found.`);
mkdirSync(path.join(root, "dist"), { recursive: true });
const out = path.join(root, "dist", release ? "Dr.Rock.apk" : "Dr.Rock-debug.apk");
copyFileSync(built, out);
console.log(`\n✔ APK ready: ${out}\n`);
