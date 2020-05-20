import React, { useContext } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeArea } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Components
import Button from '../components/Button';
import Panel from '../components/Panel';

// Config
import colors from '../config/colors';
import globalStyles from '../config/styles';

// Screens
import ManagementScreen from './ManagementScreen';
import ResourceScreen from './ResourceScreen';
import SettingsScreen from './SettingsScreen';

// Services
import { FirebaseContext } from '../services/firebase';
import { SessionContext } from '../services/session';

const MoreScreen = () => {
    const insets = useSafeArea();
    const navigation = useNavigation();
    const firebase = useContext(FirebaseContext);
    const session = useContext(SessionContext);

    return (
        <View
            style={[
                globalStyles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <ScrollView>
                <Panel>
                    <TouchableOpacity
                        style={[styles.item, globalStyles.underline]}
                        onPress={() => navigation.navigate('Account Settings')}>
                        <Text style={styles.itemText}>Account Settings</Text>
                    </TouchableOpacity>
                    {session?.profile?.role !== 'client' && (
                        <TouchableOpacity
                            style={[styles.item, globalStyles.underline]}
                            onPress={() => navigation.navigate('Management')}>
                            <Text style={styles.itemText}>
                                Client Management
                            </Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={[styles.item]}
                        onPress={() => navigation.navigate('Resources')}>
                        <Text style={styles.itemText}>Resources</Text>
                    </TouchableOpacity>
                </Panel>
                <Button
                    text="Sign Out"
                    variant="danger"
                    onPress={() => firebase?.doSignOut()}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        paddingVertical: 15,
        margin: 0,
    },
    itemText: {
        fontSize: 20,
        margin: 0,
        textAlign: 'center',
    },
    signOut: {
        color: colors.RED,
    },
});

const MoreStack = createStackNavigator();

const Screens = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <MoreStack.Navigator initialRouteName="More">
                <MoreStack.Screen name="More" component={MoreScreen} />
                <MoreStack.Screen name="Resources" component={ResourceScreen} />
                <MoreStack.Screen
                    name="Account Settings"
                    component={SettingsScreen}
                />
                <MoreStack.Screen
                    name="Management"
                    component={ManagementScreen}
                    options={{ headerShown: false }}
                />
            </MoreStack.Navigator>
        </>
    );
};

export default Screens;
