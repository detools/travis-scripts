# @detools/travis-scripts

<!-- MarkdownTOC depth="2" autolink="true" bracket="round" style="ordered" -->

1. [What](#what)
1. [Why](#why)
1. [How to use](#how-to-use)
    * [.travis.yml](#travisyml)
    * [.tipsirc.js](#tipsircjs)
1. [Where it has been used](#where-it-has-been-used)
1. [Roadmap](#roadmap)
1. [License](#license)

<!-- /MarkdownTOC -->


## What
This module helps us (I hope it'll help you too) to manage builds and tests for applications written for React-Native.

## Why
We've built a lot of 3rd-party modules for React-Native.  
We have internal rules for every project that we are doing:  
1. All of them should have example apps with linked modules
2. All of them should have E2E-tests written with Appium
3. E2E-tests should run against example apps

To follow these rules we've copied build scripts from module to module.  
This project helps us to follow DRY principle.  

## How to use
1. First of all, you need to create your 3rd-party module.
2. After that, install `@detools/travis-scripts` as devDependency:
  ```sh
  npm i @detools/travis-scripts -D
  ```
3. This module will create two files:
  ```
  .travis.yml
  .tipsirc.js
  ```

**Let's take a closer look:**

### .travis.yml
```yaml
matrix:
  include:
    - os: osx
      language: objective-c
      osx_image: xcode9.4
      env:
        - OS: 'ios'

    - os: linux
      language: android
      jdk: oraclejdk8
      sudo: required
      android:
        components:
          - platform-tools
          - tools
          - build-tools-27.0.3
          - android-21
          - android-27
          - sys-img-armeabi-v7a-android-21
          - extra-android-m2repository
          - extra-google-m2repository
          - extra-google-google_play_services
      env:
        - OS: 'android'

script:
  # See https://austinpray.com/ops/2015/09/20/change-travis-node-version.html

  # Clear out whatever version of NVM Travis has.
  # Their version of NVM is probably old.
  - rm -rf ~/.nvm

  # Grab NVM.
  - git clone https://github.com/creationix/nvm.git ~/.nvm

  # Checkout the latest stable tag.
  # Note that you can just hardcode a preferred version here.
  - (cd ~/.nvm; git checkout `git describe --abbrev=0 --tags`)

  # Add nvm command available to shell
  - source ~/.nvm/nvm.sh

  # Installi a lts version of Node
  - nvm install --lts

  # Run build script
  - npm run ci
```

**.travis.yml** — is a config for Travis CI. It contains a matrix with jobs for iOS and Android.  
* `sys-img-armeabi-v7a-android-21` is an Emulator image with Android SDK 21 on board.
* This is an ARM image because we can't use x86 Emulators.
* Another parts of Android components just contains required parts to build an Android App.
* We define an according `OS` variable (one more value to tests these scripts locally is `both`).
* Also, we detect if your operating system is not a macOS — we won't to run an iOS tasks.
* `OS=both` is a default behaviour.
* Script does install and run a `ci` — the only command to build and test example apps

### .tipsirc.js
```js
export default {
  // Default value — { ios: '', android: '', podspec: '' }
  test: {
    ios: 'npm run test:ios',
    android: 'npm run test:android',
  },
}
```

**.tipsirc.js** — is a config for `@detools/travis-scripts`.  
It contains optional and required fields that needs to be managed by project maintainer.  
Let see them all:
```js
export default {
  // @description Just checked passed variables in process.env
  // @see checkRequiredVariables
  // @example ['API_KEY', 'API_URL', 'MERCHANT_ID']
  requiredVariables: [], // Default value. Optional

  // @description An array with npm scripts as strings or plain functions to run. 
  // @see runBeforeCreateProjects
  // @example ['npm run my-awesome-npm-script', () => console.log('Hello world')]
  beforeCreateProjects: [], // Default value. Optional

  // @description
  // A list of files you've changed on your example app.
  // They will be copied to reproduce your example app code.
  // We need this to create a new example app through the tests and check that link works correct.
  // Different folder example_podspec need to check installation of module via "podspec"
  // Currently, this list contains minimum required files that you may change while development.
  // Handles 0.49 breaking change for index.{ios,android}.js => index.js transformation
  // @see copyNecessaryFiles
  // @example ['myFilePathFromProjectRoot.js']
  filesToCopy: [
    '.appiumhelperrc',
    'package.json',
    'android/build.gradle',
    'android/gradle/wrapper/gradle-wrapper.properties',
    'android/app/src/main/AndroidManifest.xml',
    `ios/${PROJECT}/AppDelegate.m`,
    `ios/${PROJECT}/Info.plist`,
    'src',
    'scripts',
    '__tests__',
    'rn-cli.config.js',
    'App.js',
    'ios/Podfile',
  ], // Default value. Optional

  // @description Indicator for project that using Pods. macOS only
  // @see installPods
  // @xample true | false
  usePods: false, // Default value. Optional

  // @description Indicator for project that using Appium as a test framework
  // @see runAppium
  // @xample true | false
  useAppium: true, // Default value. Optional

  // @description An array with npm scripts as strings or plain functions to run
  // @see runAfterInstall
  // @example ['npm run my-awesome-npm-script', () => console.log('Hello world')]
  afterInstall: [], // Default value. Optional

  // @description Just pass additional variables to build
  // @see buildIOS, buildAndroid
  additionalVariablesToBuild: {
    ios: [],
    android: [],
    podspec: [],
  }, // Default value. Optional

  // @description You can define custom build commands for iOS, Android, Podspec builds
  // @see buildIOS, buildAndroid
  // @example see in `test`
  build: {
    ios: '',
    android: '',
    podspec: '',
  }, // Default value. Optional

  // @description Just pass additional variables to test
  // @see runTestsIOS, runTestsAndroid
  additionalVariablesToTest: {
    ios: [],
    android: [],
    podspec: [],
  }, // Default value. Optional

  // @description Commands to run tests for both platforms. Should be described in example app
  // @see runTestsIOS, runTestsAndroid
  test: {
    ios: 'npm run test:ios',
    android: 'npm run test:android',
  }, // Default value. !!!REQUIRED!!!

  // @description If you would like to run tests in loop or to detect a problem. You're welcome!
  // @see runTests
  // @example 100
  runTestsCount: 1, // Default value. Optional

  // @description If you run your tests in loop, but want to exit from tests on first fail. You're welcome!
  // @see runTests
  // @example true | false
  failFast: true,

  // @description Name of Simulator/Emulator to run (and create on CI) for tests
  // @see runAndroidEmulator
  virtualDevice: {
    ios: 'iPhone 6', // Optional
    android: 'tipsi-android-5.1.1-22', // !!!REQUIRED!!!
  }, // Default value. !!!REQUIRED!!!

  // @description Indicator to create sdcard for Android Emulator and put it path to emulator config
  // @see runAndroidEmulator
  // @example true | false
  androidEmulatorNeedsWritableStorage: false, // Default value. Optional
}
```

## Where it has been used
* [tipsi-camera-roll](https://github.com/tipsi/tipsi-camera-roll)

## Roadmap
* Integrate to:
    * [tipsi-stripe](https://github.com/tipsi/tipsi-stripe)
    * [tipsi-router](https://github.com/tipsi/tipsi-router)
    * [tipsi-twitter](https://github.com/tipsi/tipsi-twitter)
* Add bin scripts
* Create a npx command to bootstrap new modules with example apps and tests from CLI
* Add podspec generator
* Use passed fields to config `additionalVariablesToBuild`, `build`, `additionalVariablesToTest`

## License

MIT License

Copyright (c) 2018 Tipsi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
