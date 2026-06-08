/**
 * Custom Expo config plugin to pin the Gradle wrapper version.
 *
 * `expo prebuild --clean` regenerates android/ from scratch each time,
 * so manual edits to gradle-wrapper.properties are lost. This plugin
 * runs during prebuild and:
 * 1. Downloads the Gradle distribution zip to the project root (if not cached)
 * 2. Sets distributionUrl to a local relative path
 *
 * This bypasses the Gradle wrapper JAR's hardcoded 10-second read timeout
 * which makes it impossible to download ~150MB from any external URL on
 * CI servers with limited bandwidth.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');
const https = require('https');

const TARGET_GRADLE_VERSION = '8.11.1';
const GRADLE_MIRROR_URL = 'https://mirrors.tencent.com/gradle';

/**
 * Download a file from URL to local path using Node.js https.
 * Uses a 5-minute timeout (vs Gradle wrapper's hardcoded 10s).
 */
function downloadFile(url, destPath, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) {
      reject(new Error('Too many redirects'));
      return;
    }

    const file = fs.createWriteStream(destPath);
    const request = https.get(url, { timeout: 300000 }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        file.close();
        fs.unlinkSync(destPath);
        downloadFile(response.headers.location, destPath, redirectCount + 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const totalSize = parseInt(response.headers['content-length'], 10) || 0;
      let downloadedSize = 0;

      response.on('data', (chunk) => {
        downloadedSize += chunk.length;
        if (totalSize > 0 && downloadedSize % (10 * 1024 * 1024) < chunk.length) {
          const pct = ((downloadedSize / totalSize) * 100).toFixed(1);
          console.log(`[with-gradle-version] Download progress: ${pct}%`);
        }
      });

      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`[with-gradle-version] Download complete (${(downloadedSize / 1024 / 1024).toFixed(1)} MB)`);
        resolve();
      });

      file.on('error', (err) => {
        file.close();
        fs.unlink(destPath, () => {});
        reject(err);
      });
    });

    request.on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });

    request.on('timeout', () => {
      request.destroy();
      file.close();
      fs.unlink(destPath, () => {});
      reject(new Error('Download timeout (300s)'));
    });
  });
}

async function withGradleVersion(config) {
  return withDangerousMod(config, [
    'android',
    async (exportedConfig) => {
      const platformProjectRoot = exportedConfig.modRequest.platformProjectRoot;
      const projectRoot = path.dirname(platformProjectRoot);
      const wrapperPath = path.join(
        platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );
      const zipFilename = `gradle-${TARGET_GRADLE_VERSION}-bin.zip`;
      const zipPath = path.join(projectRoot, zipFilename);

      // Download Gradle distribution if not already cached
      if (!fs.existsSync(zipPath)) {
        const url = `${GRADLE_MIRROR_URL}/${zipFilename}`;
        console.log(`[with-gradle-version] Downloading Gradle ${TARGET_GRADLE_VERSION} from ${url}...`);
        console.log(`[with-gradle-version] Saving to ${zipPath}`);
        try {
          await downloadFile(url, zipPath);
          console.log(`[with-gradle-version] Gradle ${TARGET_GRADLE_VERSION} downloaded successfully`);
        } catch (err) {
          console.warn(`[with-gradle-version] Failed to download Gradle: ${err.message}`);
          console.warn('[with-gradle-version] Will keep default distributionUrl, build may fail');
          return exportedConfig;
        }
      } else {
        console.log(`[with-gradle-version] Using cached Gradle ${TARGET_GRADLE_VERSION} at ${zipPath}`);
      }

      if (!fs.existsSync(wrapperPath)) {
        console.warn('[with-gradle-version] gradle-wrapper.properties not found, skipping');
        return exportedConfig;
      }

      let contents = fs.readFileSync(wrapperPath, 'utf-8');

      // Use relative path from android/gradle/wrapper/ to project root
      // android/gradle/wrapper/ -> ../../../ = project root
      const relativePath = `../../../${zipFilename}`;

      contents = contents.replace(
        /distributionUrl=.+/,
        `distributionUrl=${relativePath}`
      );

      fs.writeFileSync(wrapperPath, contents, 'utf-8');
      console.log(`[with-gradle-version] Pinned Gradle wrapper to ${TARGET_GRADLE_VERSION} (local: ${relativePath})`);

      return exportedConfig;
    },
  ]);
}

module.exports = withGradleVersion;
