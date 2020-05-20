import React, { useState, useContext } from 'react';
import { StyleSheet, View, Text, KeyboardAvoidingView } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import constants from '../config/constants';
import globalStyles from '../config/styles';

import Panel from '../components/Panel';
import Button from '../components/Button';
import FormTextInput from '../components/FormTextInput';

import { FirebaseContext } from '../services/firebase';

const LoginScreen = () => {
    const insets = useSafeArea();
    const firebase = useContext(FirebaseContext);

    const passwordInputRef = React.createRef<FormTextInput>();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const [emailTouched, setEmailTouched] = useState(false);
    const [passwordTouched, setPasswordTouched] = useState(false);

    const emailErrorString =
        !email && emailTouched ? 'Email is required' : undefined;

    const passwordErrorString =
        !password && passwordTouched ? 'Password is required' : undefined;

    const disabled = !email || !password;

    const onSubmitButtonPress = () => {
        if (firebase) {
            firebase
                .doSignInWithEmailAndPassword(email, password)
                .then(() => {
                    setMessage('Logged in');
                })
                .catch((err) => setMessage(err.message));
        }
    };

    return (
        <View
            style={[
                globalStyles.container,
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                },
            ]}>
            <KeyboardAvoidingView behavior="padding">
                <Panel style={styles.flexOne}>
                    <Text style={styles.title}>Debt2Wealth Calculator</Text>
                    <FormTextInput
                        value={email}
                        error={emailErrorString}
                        onChangeText={(value) => setEmail(value)}
                        onBlur={() => setEmailTouched(true)}
                        onSubmitEditing={() => {
                            if (passwordInputRef.current) {
                                passwordInputRef.current.focus();
                            }
                        }}
                        placeholder="Email Address"
                        keyboardType="email-address"
                        autoCorrect={false}
                        returnKeyType="next"
                        autoCapitalize="none"
                        blurOnSubmit={constants.IS_IOS}
                    />
                    <FormTextInput
                        value={password}
                        error={passwordErrorString}
                        ref={passwordInputRef}
                        onChangeText={(value) => setPassword(value)}
                        onBlur={() => setPasswordTouched(true)}
                        placeholder="Password"
                        secureTextEntry
                        returnKeyType="done"
                        autoCapitalize="none"
                    />
                    <Button
                        text="Sign In"
                        onPress={onSubmitButtonPress}
                        disabled={disabled}
                    />
                    <Text style={styles.message}>{message}</Text>
                </Panel>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    flexOne: {
        height: 'auto',
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
    },
    message: {
        height: 20,
    },
});

export default LoginScreen;
