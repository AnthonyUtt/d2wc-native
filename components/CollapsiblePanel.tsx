import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import colors from '../config/colors';

type HidableViewPropsType = {
    children: React.ReactNode;
    hidden: boolean;
    style?: Object;
};

const HidableView = ({ children, hidden, style }: HidableViewPropsType) => {
    if (hidden) {
        return null;
    }
    return <View style={style}>{children}</View>;
};

type CollapsiblePanelPropsType = {
    header: React.ReactNode;
    children: React.ReactNode;
    style?: Object;
    onLongPress?: () => void;
};

const CollapsiblePanel = ({
    header,
    children,
    style,
    onLongPress,
}: CollapsiblePanelPropsType) => {
    const [show, setShow] = useState(true);

    const onPress = () => {
        setShow(!show);
    };
    return (
        <TouchableOpacity
            style={[styles.panel, style]}
            onPress={onPress}
            onLongPress={onLongPress}>
            {header}
            <HidableView hidden={show}>{children}</HidableView>
        </TouchableOpacity>
    );
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

export default CollapsiblePanel;
