# proximiio-navigation-demo-react-native

## Installation

```
git clone https://github.com/proximiio/proximiio-navigation-demo-react-native.git
cd proximiio-navigation-demo-react-native
yarn install
cd ios
pod install
```

If "pod install" command ends with following error:
"None of your spec sources contain a spec satisfying the dependency: `ProximiioMapbox (= 5.1.8)`"
please run "pod repo update" followed by "pod install"

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
yarn start ios
```
