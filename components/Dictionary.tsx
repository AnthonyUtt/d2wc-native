import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type TermProps = {
    children: string;
};

export const DictionaryTerm = ({ children }: TermProps) => {
    return <Text style={styles.term}>{children}</Text>;
};

type DefinitionProps = {
    children: React.ReactNode;
};

export const DictionaryDefinition = ({ children }: DefinitionProps) => {
    return <View style={styles.definition}>{children}</View>;
};

type DictionaryProps = {
    children: React.ReactNode[];
};

const Dictionary = ({ children }: DictionaryProps) => {
    return <View>{children}</View>;
};

const styles = StyleSheet.create({
    term: {
        fontWeight: 'bold',
    },
    definition: {
        margin: 10,
        paddingLeft: 10,
    },
});

export default Dictionary;
