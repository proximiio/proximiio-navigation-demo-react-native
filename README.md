# proximiio-navigation-demo-react-native

## Installation

```
git clone https://github.com/proximiio/proximiio-navigation-demo-react-native.git
cd proximiio-navigation-demo-react-native
yarn install
cd ios
pod install
```

### Apple M1 Users

Its necessary to run both terminal with "pod install" and the XCode in Rosetta Mode
(right click on /Applications/XCode and /Applications/Utilities/Terminal and enable "Open Using Rosettta")

## Configuration

Enter Proximi.io Application Token in "src/utils/Constants.tsx"

### IOS Specific Configuration
Click RNDemoApp in the Project Browser on the left, then select RnDemoApp under Targets, click "Signing & Capabilities" tab and finish your app signing setup.

## Start

Run IOS version using following command:
```
yarn start ios
```

Run Android version using following command:
```
yarn start android
```
