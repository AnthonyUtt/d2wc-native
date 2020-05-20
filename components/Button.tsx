import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors from '../config/colors';

interface ButtonProps {
    text: string;
    onPress: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'danger';
}

const Button = ({ text, onPress, variant }: ButtonProps) => {
    let buttonStyle = [
        styles.button,
        variant === 'danger' ? styles.buttonDanger : null,
    ];

    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
        marginTop: 15,
        marginHorizontal: 15,
        marginBottom: 0,
        backgroundColor: colors.BLUE,
        borderRadius: 10,
    },
    buttonDanger: {
        backgroundColor: colors.RED,
    },
    buttonDisabled: {
        opacity: 0.3,
    },
    buttonEnabled: {
        opacity: 1,
    },
    text: {
        color: 'white',
        textAlign: 'center',
        height: 20,
    },
});

export default Button;
