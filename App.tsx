/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
import 'react-native-gesture-handler';

import React, { useContext } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Config
import colors from './config/colors';

// Services
import Firebase, { FirebaseContext } from './services/firebase';
import Session, { SessionContext } from './services/session';

// Screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import AccountsScreen from './screens/AccountsScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import InvestmentScreen from './screens/InvestmentScreen';
import MoreScreen from './screens/MoreScreen';

declare const global: { HermesInternal: null | {} };

const SignInStack = createStackNavigator();

const SignInScreens = () => (
    <SignInStack.Navigator>
        <SignInStack.Screen
            name="Sign In"
            component={LoginScreen}
            options={{ headerShown: false }}
        />
    </SignInStack.Navigator>
);

const HomeTab = createBottomTabNavigator();

const HomeScreens = () => (
    <HomeTab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName: string;

                switch (route.name) {
                    case 'Home':
                        iconName = focused ? 'ios-home' : 'ios-home';
                        break;
                    case 'Accounts':
                        iconName = focused ? 'md-list-box' : 'md-list-box';
                        break;
                    case 'Schedule':
                        iconName = focused ? 'ios-calendar' : 'ios-calendar';
                        break;
                    case 'Investment':
                        iconName = focused
                            ? 'ios-trending-up'
                            : 'ios-trending-up';
                        break;
                    case 'More':
                        iconName = focused ? 'ios-more' : 'ios-more';
                        break;
                    default:
                        iconName = '';
                        break;
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
        })}
        tabBarOptions={{
            activeTintColor: colors.GREEN,
            inactiveTintColor: colors.CHARCOAL,
        }}>
        <HomeTab.Screen name="Home" component={HomeScreen} />
        <HomeTab.Screen name="Accounts" component={AccountsScreen} />
        <HomeTab.Screen name="Schedule" component={ScheduleScreen} />
        <HomeTab.Screen name="Investment" component={InvestmentScreen} />
        <HomeTab.Screen name="More" component={MoreScreen} />
    </HomeTab.Navigator>
);

const AppBase = () => {
    const session = useContext(SessionContext);

    const Screen = () => (!session?.user ? <SignInScreens /> : <HomeScreens />);

    return (
        <>
            <SafeAreaProvider>
                <NavigationContainer>
                    <StatusBar
                        backgroundColor={colors.GREEN}
                        barStyle="light-content"
                    />
                    <Screen />
                </NavigationContainer>
            </SafeAreaProvider>
        </>
    );
};

const App = () => (
    <FirebaseContext.Provider value={new Firebase()}>
        <Session>
            <AppBase />
        </Session>
    </FirebaseContext.Provider>
);

export default App;
