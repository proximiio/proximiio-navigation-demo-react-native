import * as React from 'react';
import {
  BackHandler,
  Linking, Route,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import i18n from 'i18next';
import WebView from 'react-native-webview';
import RoundedButton from '../../utils/RoundedButton';
import {Colors, Shadow} from '../../Style';
import Proximiio from 'react-native-proximiio';

interface Props {
  route?: Route;
}
interface State {}

/**
 * Screen with detailed info about POI Feature.
 */
export default class PolicyScreen extends React.Component<Props, State> {
  state = {};
  private webViewReference;

  render() {
    return (
      <View style={styles.container}>
        <WebView
          ref={(ref) => {this.webViewReference = ref;}}
          automaticallyAdjustContentInsets={false}
          scalesPageToFit={false}
          onNavigationStateChange={this.onWebViewNavigationStateChange}
          style={{margin: 16}}
          source={{html: this.getWebviewBody(i18n.t('policyscreen.privacy-policy-text'))}} />
        {!(this.props.route && this.props.route.params.policyAccepted) && (
          <View style={styles.buttons}>
            <RoundedButton
              buttonStyle={styles.acceptButton}
              title={i18n.t('policyscreen.accept')}
              onPress={this.onAccepted}
            />
            <TouchableOpacity onPress={this.onDeclined} style={styles.declineButton}>
              <Text style={styles.declineButtonText}>
                {i18n.t('policyscreen.decline')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {(this.props.route && this.props.route.params.policyAccepted) && (
          <Text style={styles.visitorId}>
            {i18n.t('policyscreen.visitor-id') + Proximiio.state.visitorId}
          </Text>
        )}
      </View>
    );
  }

  private onAccepted = async () => {
    this.props.route.params.onPolicyAccepted();
  };

  private onDeclined = () => {
    BackHandler.exitApp();
  };

  private onWebViewNavigationStateChange = (event) => {
    if (event.url.startsWith('http')) {
      this.webViewReference.stopLoading();
      Linking.openURL(event.url);
    }
  };

  private getWebviewBody(content: String) {
    const textColor = '#444';
    const backgroundColor = '#f2f2f2';
    return '' +
      "<body style=\"background-color: " + backgroundColor + "; color: " + textColor + "; font-size: 0.9em; margin: 0 0 0 0; padding: 0 0 0 0;\">" +
        "<style>" +
          "ul { padding-left: 1.5em }" +
          "h2 { color: %s; font-size: 1em; margin: 0 0 0.4em 0; font-weight: bold; }" +
        "</style>" +
        content +
      "</body>";
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 16,
  },
  buttons: {
    alignSelf: 'center',
  },
  acceptButton: {
    ...Shadow,
  },
  declineButton: {
    alignSelf: 'center',
    padding: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  declineButtonText: {
    color: Colors.blue,
  },
  visitorId: {
    color: Colors.blueDark2,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
