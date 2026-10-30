# JIMMY TECH: build and publish

This folder builds the app for **Android** (APK and AAB), **Windows** (installer and portable .exe) and the **website** (GitHub Pages) from one file: `www/index.html`.

## One-time setup on GitHub
1. Create a repository and upload everything in this folder, including the hidden `.github` folder.
2. Repository **Settings > Pages > Source: GitHub Actions**.
3. Android signing key (needed so the APK can be installed and updated properly):
   - Make the key once, on any computer with Java:
     `keytool -genkeypair -v -keystore jimmytech.keystore -alias jimmytech -keyalg RSA -keysize 2048 -validity 10000`
   - Turn it into text. Windows PowerShell: `[Convert]::ToBase64String([IO.File]::ReadAllBytes("jimmytech.keystore"))`  (Mac/Linux: `base64 -w0 jimmytech.keystore`)
   - Repository **Settings > Secrets and variables > Actions**, add four secrets:
     `ANDROID_KEYSTORE_BASE64` (the text from the step above), `ANDROID_KEYSTORE_PASSWORD`, `ANDROID_KEY_ALIAS` (jimmytech), `ANDROID_KEY_PASSWORD`.
   - Keep `jimmytech.keystore` somewhere safe. If you lose it, you can never update the same app again.
   - Without these secrets the workflow still works but only makes a **test APK**.

## Build and publish
- **Every push to `main`** builds the Android and Windows files (download them from the run, under *Artifacts*) and updates the website.
- **To publish a release**, tag a version:
  `git tag v1.0.0` then `git push origin v1.0.0`
  GitHub then creates a Release with:
  `JIMMYTECH-1.0.0.apk`, `JIMMYTECH-1.0.0.aab` (for Google Play), `JIMMYTECH-Setup-1.0.0.exe`, `JIMMYTECH-Portable-1.0.0.exe`.
- **To update the app**, replace `www/index.html`, push, then tag the next version (v1.0.1, v1.0.2, ...).

## Before installing over an older version
The shop data is stored on each device. In the app open **Settings > Protect your data > Download backup** first. After installing, use **Restore backup**. If Android says the app cannot be installed over the old one, uninstall the old app first (after the backup).

## If something looks off
- Status bar icons hard to see on Android: in `capacitor.config.json` change `"style": "DARK"` to `"LIGHT"`.
- Windows may show a blue "SmartScreen" warning for an unsigned .exe: choose **More info > Run anyway**.
- A build fails: open the failed run under the **Actions** tab and read the red step.
