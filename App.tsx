import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Linking, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import urlParse from 'url-parse';

function FirstScreen() {

  return (
    <View style={styles.centerTextContainer}>
      <Text>First</Text>
    </View>
  );
}

function SecondScreen() {
  return (
    <View style={styles.centerTextContainer}>
      <Text>Second</Text>
    </View>
  );
}

function ThirdScreen(props: {route: { params: any; };}) {
  return (
    <View style={styles.centerTextContainer}>
      <Text>Third , Params: {JSON.stringify(props.route.params)}</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

const App = () => {

  let navigationRef: { navigate: (arg0: string | (string | null)[] | null, arg1: { params: string | (string | null)[] | null; }) => void; };

  function intiNavigation(ref: { navigate: (arg0: string | (string | null)[] | null, arg1: { params: string | (string | null)[] | null; }) => void; }) {
    if (ref) {
      navigationRef = ref;
      // handle deep link that app isn't launched
      Linking.getInitialURL().then((url) => {
        console.log("2. url: " + url);
        handleDeepLink({url});
      });
    }
  }

  function handleDeepLink({url}) {
    if (url) {
      const parsedUrl = urlParse(url, true);
      console.log(parsedUrl);
      // use host as route name and query as navigation params
      if(parsedUrl){
          navigationRef.navigate({
            name: parsedUrl.host,
            params: parsedUrl.query,
        });
      }
    }
  }
  

  useEffect(() => {
    // add deep link listener to handle deep link after app is launched
    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeAllListeners('url', handleDeepLink);
    };
  });
  

  return (
    <NavigationContainer ref={intiNavigation}>
      <Tab.Navigator>
        <Tab.Screen name="first" component={FirstScreen} />
        <Tab.Screen name="second" component={SecondScreen} />
        <Tab.Screen name="third" component={ThirdScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  centerTextContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
