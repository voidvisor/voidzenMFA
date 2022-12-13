/**
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { StatusBar, useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { themeColors, lightTheme, darkTheme } from './components/core/Themes';
import AuthStack from './components/views/AuthStack';

declare global {
  namespace ReactNativePaper {
    interface ThemeColors {
      description?: string,
    }
  }
}

const Tab = createMaterialBottomTabNavigator();

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const Colors = isDarkMode ? themeColors.dark : themeColors.light;
  const theme = isDarkMode ? darkTheme : lightTheme

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Accounts"
          activeColor={Colors.white}
          inactiveColor={Colors.lightGray}
          barStyle={{ backgroundColor: Colors.primary }}
        >
          <Tab.Screen name="Accounts" component={AuthStack} options={{tabBarIcon: 'shield-key'}} />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
