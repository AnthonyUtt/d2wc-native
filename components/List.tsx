/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, View } from 'react-native';

type ListItemProps = {
    item: string;
    separator: string;
};

export type ListProps = {
    items: Array<string>;
};

const ListItem = ({ item, separator }: ListItemProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                marginHorizontal: 15,
                marginBottom: 5,
            }}>
            <Text>{separator}</Text>
            <Text> </Text>
            <Text>{item}</Text>
        </View>
    );
};

export const UnorderedList = ({ items }: ListProps) => {
    return (
        <View style={{ marginTop: 10 }}>
            {items.map((item, index) => (
                <ListItem key={index} item={item} separator={'\u2022'} />
            ))}
        </View>
    );
};

export const OrderedList = ({ items }: ListProps) => {
    return (
        <View style={{ marginTop: 10 }}>
            {items.map((item, index) => (
                <ListItem key={index} item={item} separator={`${index + 1}.`} />
            ))}
        </View>
    );
};
