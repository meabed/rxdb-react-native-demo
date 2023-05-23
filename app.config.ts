import 'dotenv/config';

import { ConfigContext, ExpoConfig } from '@expo/config';

const packageJson = require('./package.json');

function appConfig({ config }: ConfigContext): Partial<ExpoConfig> {
  return {
    ...config,
    version: '1.0.0',
    sdkVersion: packageJson.dependencies.expo,
    platforms: ['ios', 'android'],
    orientation: 'portrait',
    userInterfaceStyle: 'light',
    updates: {
      fallbackToCacheTimeout: 0,
    },
    jsEngine: 'hermes',
    assetBundlePatterns: ['**/*'],
    ios: {
      bundleIdentifier: 'com.meabed.rxdbdemo',
      supportsTablet: true,
      googleServicesFile: './assets/config/GoogleService-Info.plist',
    },
    android: {
      package: 'com.meabed.rxdbdemo',
      versionCode: 8,
      googleServicesFile: './assets/config/google-services.json',
    },
    plugins: [
      [
        'expo-build-properties',
        {
          android: {
            kotlinVersion: '1.8.0',
            enableProguardInReleaseBuilds: false,
            disableAutomaticComponentCreation: true,
          },
          ios: {
            deploymentTarget: '13.0',
            useFrameworks: 'static',
          },
        },
      ],
    ].filter(Boolean) as ExpoConfig['plugins'],
    extra: {
      isTesting: process.env.NODE_ENV === 'test',
    },
  };
}

export default appConfig;
