import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import DraggableFlatlist, {
    RenderItemParams,
    DragEndParams,
} from 'react-native-draggable-flatlist';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RouteProp, useNavigation } from '@react-navigation/native';
import {
    createStackNavigator,
    StackNavigationProp,
} from '@react-navigation/stack';

// Components
import Button from '../components/Button';
import CollapsiblePanel from '../components/CollapsiblePanel';
import FormTextInput from '../components/FormTextInput';
import Panel from '../components/Panel';

// Config
import colors from '../config/colors';
import {
    formatCurrency,
    formatPercentage,
    orderAccounts,
} from '../config/functions';
import globalStyles from '../config/styles';
import { AccountFlat } from '../config/types';

// Services
import { FirebaseContext } from '../services/firebase';
import { SessionContext } from '../services/session';
import { createSchedule } from '../services/schedule';

type AccountStackParamList = {
    Account: undefined;
    Edit: {
        accounts: Array<AccountFlat>;
        setAccounts: (accts: Array<AccountFlat>) => void;
        trigger: boolean;
        setTrigger: (value: boolean) => void;
        item?: AccountFlat;
        index: number;
    };
};

type EditScreenRouteProp = RouteProp<AccountStackParamList, 'Edit'>;

type EditScreenNavigationProp = StackNavigationProp<
    AccountStackParamList,
    'Edit'
>;

type Props = {
    route: EditScreenRouteProp;
    navigation: EditScreenNavigationProp;
};

const EditAccountScreen = ({ route, navigation }: Props) => {
    const insets = useSafeArea();

    const {
        accounts,
        setAccounts,
        trigger,
        setTrigger,
        item,
        index,
    } = route.params;

    const [creditor, setCreditor] = useState(item ? item.creditor : '');
    const [balance, setBalance] = useState(
        item?.balance ? formatCurrency(item?.balance) : '',
    );
    const [rate, setRate] = useState(
        item?.rate ? formatPercentage(item?.rate) : '',
    );
    const [payment, setPayment] = useState(
        item?.payment ? formatCurrency(item?.payment) : '',
    );

    const balanceRef = React.createRef<FormTextInput>();
    const rateRef = React.createRef<FormTextInput>();
    const paymentRef = React.createRef<FormTextInput>();

    const onSubmit = () => {
        let newAcct: AccountFlat = {
            id: item ? item.id : '',
            creditor,
            balance: Number(balance.replace(',', '').replace('$', '')),
            rate: Number(rate.replace('%', '')) / 100,
            payment: Number(payment.replace(',', '').replace('$', '')),
            custom: item ? item.custom : accounts.length,
        };

        let accts = accounts;
        accts.splice(index, 1, newAcct);
        setAccounts(accts);
        setTrigger(!trigger);
        navigation.goBack();
    };

    const onDelete = () => {
        let accts = accounts;
        accts.splice(index, 1);
        setAccounts(accts);
        setTrigger(!trigger);
        navigation.goBack();
    };

    return (
        <View
            style={[
                globalStyles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <ScrollView>
                <Panel>
                    <View style={globalStyles.splitRow}>
                        <View style={styles.halfWidth}>
                            <Text style={styles.padToFit}>Creditor</Text>
                            <Text style={styles.padToFit}>Balance</Text>
                            <Text style={styles.padToFit}>Rate</Text>
                            <Text style={styles.padTop}>Minimum Payment</Text>
                        </View>
                        <View style={styles.halfWidth}>
                            <FormTextInput
                                value={creditor}
                                onChangeText={(value) => setCreditor(value)}
                                onSubmitEditing={() => {
                                    if (balanceRef.current) {
                                        balanceRef.current.focus();
                                    }
                                }}
                                placeholder="Creditor"
                                returnKeyType="next"
                                autoCapitalize="words"
                                autoCorrect={false}
                            />
                            <FormTextInput
                                ref={balanceRef}
                                value={balance}
                                onChangeText={(value) => setBalance(value)}
                                onSubmitEditing={() => {
                                    if (rateRef.current) {
                                        rateRef.current.focus();
                                    }
                                }}
                                placeholder="e.g. $15,000"
                                returnKeyType="next"
                                keyboardType="numbers-and-punctuation"
                            />
                            <FormTextInput
                                ref={rateRef}
                                value={rate}
                                onChangeText={(value) => setRate(value)}
                                onSubmitEditing={() => {
                                    if (paymentRef.current) {
                                        paymentRef.current.focus();
                                    }
                                }}
                                placeholder="e.g. 13.49%"
                                returnKeyType="next"
                                keyboardType="numbers-and-punctuation"
                            />
                            <FormTextInput
                                ref={paymentRef}
                                value={payment}
                                onChangeText={(value) => setPayment(value)}
                                placeholder="e.g. $150"
                                returnKeyType="done"
                                keyboardType="numbers-and-punctuation"
                            />
                        </View>
                    </View>
                    {index !== accounts.length && (
                        <Button
                            text="Delete Account"
                            onPress={onDelete}
                            variant="danger"
                        />
                    )}
                    <Button text="Save Changes" onPress={onSubmit} />
                </Panel>
            </ScrollView>
        </View>
    );
};

const AccountsScreen = () => {
    const insets = useSafeArea();
    const navigation = useNavigation();
    const firebase = useContext(FirebaseContext);
    const session = useContext(SessionContext);

    const [initAccts, setInitAccts] = useState<Array<AccountFlat>>([]);
    const [accounts, setAccounts] = useState<Array<AccountFlat>>([]);

    const [trigger, setTrigger] = useState(false);

    const [saveButtonText, setSaveButtonText] = useState('Save Changes');

    useEffect(() => {
        if (session && session.user) {
            if (!accounts.length) {
                firebase
                    ?.doGetUserDetailRecords(session.user.uid)
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            let acct: AccountFlat = {
                                id: doc.id,
                                creditor: doc.data().creditor,
                                balance: doc.data().balance,
                                rate: doc.data().rate,
                                payment: doc.data().payment,
                                custom: doc.data().custom,
                            };

                            setInitAccts((accts) => accts.concat(acct));
                            setAccounts((accts) => accts.concat(acct));
                        });
                    })
                    .catch((err) => console.error(err));
            }
        }
    }, [session, firebase, accounts.length]);

    useLayoutEffect(() => {
        setSaveButtonText('Save Changes');
    }, [trigger]);

    const updateSchedule = () => {
        if (!session || !session.profile) {
            return;
        }

        let accts = orderAccounts(accounts, 'customAsc');

        if (!session.profile.payment) {
            navigation.navigate('More', { screen: 'Account Settings' });
            return;
        }

        return createSchedule(
            accts,
            session?.profile.payment,
            session?.profile.float,
            session?.profile.frequency,
        );
    };

    const onAdd = () => {
        navigation.navigate('Edit', {
            accounts,
            setAccounts,
            trigger,
            setTrigger,
            index: accounts.length,
        });
    };

    const onSave = () => {
        if (!accounts.length) {
            return;
        }

        setSaveButtonText('Saving...');

        const toAdd = accounts.filter(
            (x) => !initAccts.some((y) => y.id === x.id),
        );
        const toRemove = initAccts.filter(
            (x) => !accounts.some((y) => y.id === x.id),
        );
        const toUpdate = accounts.filter((x) =>
            initAccts.some(
                (y) =>
                    y.id === x.id &&
                    (y.creditor !== x.creditor ||
                        y.balance !== x.balance ||
                        y.rate !== x.rate ||
                        y.payment !== x.payment ||
                        y.custom !== x.custom),
            ),
        );

        toAdd.forEach((acct) => {
            if (!session || !session.user) {
                return;
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...props } = acct;
            firebase
                ?.doAddUserDetailRecord(session?.user.uid, props)
                .then((doc) => {
                    setInitAccts((accts) =>
                        accts.concat({
                            id: doc.id,
                            ...props,
                        }),
                    );

                    let accts = accounts;
                    let index = accts.indexOf(
                        accts.filter((x) => x.creditor === acct.creditor)[0],
                    );
                    accts.splice(index, 1, { id: doc.id, ...props });
                    setAccounts(accts);
                })
                .catch((err) => console.error(err));
        });

        toRemove.forEach((acct) => {
            if (!session || !session.user) {
                return;
            }

            firebase
                ?.doDeleteUserDetailRecord(session?.user.uid, acct.id)
                .then(() => {
                    let accts = initAccts;
                    let index = -1;
                    for (let i = 0; i < accts.length; i++) {
                        if (accts[i].id === acct.id) {
                            index = i;
                        }
                    }
                    if (index !== -1) {
                        accts.splice(index, 1);
                    }
                    setInitAccts(accts);
                })
                .catch((err) => console.error(err));
        });

        toUpdate.forEach((acct) => {
            if (!session || !session.user) {
                return;
            }

            const { id, ...props } = acct;
            firebase
                ?.doUpdateUserDetailRecord(session?.user.uid, id, props)
                .then(() => {
                    let accts = initAccts;
                    let index = -1;
                    for (let i = 0; i < accts.length; i++) {
                        if (accts[i].id === acct.id) {
                            index = i;
                        }
                    }
                    if (index !== -1) {
                        accts.splice(index, 1, acct);
                    }
                    setInitAccts(accts);
                })
                .catch((err) => console.error(err));
        });

        updateSchedule()
            ?.then((schedule) => {
                if (!session || !session.user) {
                    return;
                }
                firebase
                    ?.doSetPaymentSchedule(session?.user.uid, schedule)
                    .then(() => {
                        if (session && session.profile) {
                            session.profile.schedule = schedule;
                        }
                        setSaveButtonText('Saved');
                    })
                    .catch((err) => console.error(err));
            })
            .catch((err) => console.error(err));
    };

    const renderItem = ({
        item,
        index,
        drag,
        isActive,
    }: RenderItemParams<AccountFlat>) => {
        const header = (
            <View style={globalStyles.splitRow}>
                <Text style={globalStyles.headerSection}>
                    {typeof index !== 'undefined' ? `${index + 1}. ` : null}
                    {item.creditor}
                </Text>
                <Text style={globalStyles.headerSection}>
                    {formatCurrency(item.balance)}
                </Text>
            </View>
        );
        return (
            <>
                <CollapsiblePanel
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        borderColor: isActive ? colors.BLUE : undefined,
                        borderWidth: isActive ? 3 : undefined,
                    }}
                    header={header}
                    onLongPress={drag}>
                    <View>
                        <View style={globalStyles.splitRow}>
                            <Text>Balance</Text>
                            <Text>{formatCurrency(item.balance)}</Text>
                        </View>
                        <View style={globalStyles.splitRow}>
                            <Text>Rate</Text>
                            <Text>{formatPercentage(item.rate)}</Text>
                        </View>
                        <View style={globalStyles.splitRow}>
                            <Text>Minimum Payment</Text>
                            <Text>{formatCurrency(item.payment)}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Edit', {
                                    accounts,
                                    setAccounts,
                                    trigger,
                                    setTrigger,
                                    item,
                                    index,
                                })
                            }>
                            <Text style={[globalStyles.centered, styles.link]}>
                                Edit Account Information >
                            </Text>
                        </TouchableOpacity>
                    </View>
                </CollapsiblePanel>
                {index === accounts.length - 1 ? (
                    <View style={styles.buffer} />
                ) : null}
            </>
        );
    };

    const onDragEnd = ({ data }: DragEndParams<AccountFlat>) => {
        let newOrder: Array<AccountFlat> = [];
        data.forEach((acct, index) => {
            newOrder.push({
                ...acct,
                custom: index + 1,
            });
        });
        setAccounts(newOrder);
        setTrigger(!trigger);
    };

    return (
        <View
            style={[
                globalStyles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <View>
                <Text style={globalStyles.headerWhite}>Account Details</Text>
                <Button onPress={onSave} text={saveButtonText} />
                <Button onPress={onAdd} text="Add New Account" />
                <Text style={styles.tip}>Tap to Expand, Hold to Drag</Text>
            </View>
            <View style={styles.flex}>
                <DraggableFlatlist
                    data={accounts}
                    renderItem={renderItem}
                    keyExtractor={(item, index) =>
                        `draggable-list-${item}-${index}`
                    }
                    onDragEnd={onDragEnd}
                />
                <View style={styles.buffer} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    halfWidth: {
        width: '50%',
    },
    flex: {
        flex: 1,
    },
    padToFit: {
        paddingTop: 10,
        paddingBottom: 40,
    },
    padTop: {
        paddingTop: 10,
    },
    alignRight: {
        textAlign: 'right',
    },
    tip: {
        color: colors.WHITE,
        textAlign: 'center',
        marginTop: 15,
    },
    link: {
        marginTop: 15,
        color: colors.BLUE,
    },
    buffer: {
        height: 60,
    },
    button: {
        marginTop: 15,
        marginHorizontal: 15,
    },
});

const AccountStack = createStackNavigator();

const Screens = () => {
    return (
        <>
            <StatusBar barStyle="dark-content" />
            <AccountStack.Navigator initialRouteName="Accounts">
                <AccountStack.Screen
                    name="Accounts"
                    component={AccountsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <AccountStack.Screen
                    name="Edit"
                    component={EditAccountScreen}
                    options={{ headerTitle: 'Edit Account' }}
                />
            </AccountStack.Navigator>
        </>
    );
};

export default Screens;
