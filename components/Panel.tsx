import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import colors from '../config/colors';

interface PanelProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

const Panel = ({ children, style }: PanelProps) => {
    return <View style={[styles.panel, style]}>{children}</View>;
};

const styles = StyleSheet.create({
    panel: {
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        marginTop: 15,
        marginHorizontal: 15,
        marginBottom: 0,
        padding: 15,
        shadowColor: '#333',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 5,
    },
});

export default Panel;
