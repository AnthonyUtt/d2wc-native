import React from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    Text,
} from 'react-native';
import colors from '../config/colors';

type Props = TextInputProps & {
    error?: string;
};

class FormTextInput extends React.Component<Props> {
    textInputRef = React.createRef<TextInput>();

    focus = () => {
        if (this.textInputRef.current) {
            this.textInputRef.current.focus();
        }
    };

    render() {
        const { error, style, ...otherProps } = this.props;

        return (
            <View style={styles.container}>
                <TextInput
                    ref={this.textInputRef}
                    selectionColor={colors.BLUE}
                    style={[styles.textInput, style]}
                    {...otherProps}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
    },
    textInput: {
        height: 40,
        borderColor: colors.CHARCOAL,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 15,
    },
    errorText: {
        height: 20,
        color: colors.RED,
    },
});

export default FormTextInput;
