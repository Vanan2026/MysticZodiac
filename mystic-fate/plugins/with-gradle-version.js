/**
 * Custom Expo config plugin to pin the Gradle wrapper version.
 *
 * `expo prebuild --clean` regenerates android/ from scratch each time,
 * so manual edits to gradle-wrapper.properties are lost. This plugin
 * runs during prebuild and patches the file to use a known-good Gradle
 * version that the CI environment can reliably download.
 */
const { withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const TARGET_GRADLE_VERSION = '8.11.1';

function withGradleVersion(config) {
  return withDangerousMod(config, [
    'android',
    (exportedConfig) => {
      const wrapperPath = path.join(
        exportedConfig.modRequest.platformProjectRoot,
        'gradle',
        'wrapper',
        'gradle-wrapper.properties'
      );

      if (!fs.existsSync(wrapperPath)) {
        console.warn('[with-gradle-version] gradle-wrapper.properties not found, skipping');
        return exportedConfig;
      }

      let contents = fs.readFileSync(wrapperPath, 'utf-8');
      const targetUrl = `https\\://services.gradle.org/distributions/gradle-${TARGET_GRADLE_VERSION}-bin.zip`;

      contents = contents.replace(
        /distributionUrl=.+/,
        `distributionUrl=${targetUrl}`
      );

      fs.writeFileSync(wrapperPath, contents, 'utf-8');
      console.log(`[with-gradle-version] Pinned Gradle wrapper to ${TARGET_GRADLE_VERSION}`);

      return exportedConfig;
    },
  ]);
}

module.exports = withGradleVersion;
