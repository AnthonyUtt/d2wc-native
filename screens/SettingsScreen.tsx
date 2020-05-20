import React, { useState, useEffect, useContext } from 'react';
import {
    ActionSheetIOS,
    Button as NativeButton,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Picker } from '@react-native-community/picker';

// Components
import Button from '../components/Button';
import FormTextInput from '../components/FormTextInput';
import Panel from '../components/Panel';

// Config
import colors from '../config/colors';
import constants from '../config/constants';
import {
    formatCurrency,
    orderAccounts,
    printStrategy,
} from '../config/functions';
import globalStyles from '../config/styles';
import { AccountFlat, MonthlyPayment, Schedule } from '../config/types';

// Services
import { FirebaseContext } from '../services/firebase';
import { SessionContext } from '../services/session';
import { createSchedule } from '../services/schedule';

const SettingsScreen = () => {
    const firebase = useContext(FirebaseContext);
    const session = useContext(SessionContext);

    const [minimumPayment, setMinimum] = useState(0);

    const [monthlyPayment, setMonthlyPayment] = useState('');
    const [monthlyPaymentTouched, setMonthlyPaymentTouched] = useState(false);
    const monthlyPaymentErrorString =
        monthlyPaymentTouched && isNaN(+monthlyPayment)
            ? 'Must a number.'
            : undefined;

    const [incomeFloat, setIncomeFloat] = useState('');
    const [incomeFloatTouched, setIncomeFloatTouched] = useState(false);
    const incomeFloatRef = React.createRef<FormTextInput>();
    const incomeFloatErrorString =
        incomeFloatTouched && isNaN(+incomeFloat)
            ? 'Must be a number.'
            : undefined;

    const [floatFrequency, setFloatFrequency] = useState('');
    const [floatFrequencyTouched, setFloatFrequencyTouched] = useState(false);
    const frequencyRef = React.createRef<FormTextInput>();
    const frequencyErrorString =
        floatFrequencyTouched && isNaN(+floatFrequency)
            ? 'Must be a number.'
            : undefined;

    const [accounts, setAccounts] = useState<Array<AccountFlat>>([]);
    const [schedule, setSchedule] = useState<Schedule>();
    const [strategy, setStrategy] = useState('');

    const [nextPayment, setNextPayment] = useState<MonthlyPayment>();

    const [saveButtonText, setSaveButtonText] = useState('Save Changes');

    useEffect(() => {
        if (session && session.profile && session.profile.schedule) {
            setMonthlyPayment(
                session.profile.payment
                    ? (
                          Number(session.profile.payment) - minimumPayment
                      ).toFixed(2)
                    : '',
            );
            setIncomeFloat(session.profile.float ? session.profile.float : '');
            setFloatFrequency(
                session.profile.frequency ? session.profile.frequency : '2',
            );

            if (!accounts.length) {
                firebase
                    ?.doGetUserDetailRecords(session.user.uid)
                    .then((docs) => {
                        docs.forEach((doc) => {
                            let acct: AccountFlat = {
                                id: doc.id,
                                creditor: doc.data().creditor,
                                balance: doc.data().balance,
                                rate: doc.data().rate,
                                payment: doc.data().payment,
                                custom: doc.data().payment,
                            };

                            setAccounts((accts) => accts.concat(acct));
                            setMinimum((min) => min + acct.payment);
                        });
                    })
                    .catch((err) => console.error(err));
            }

            setSchedule(session.profile.schedule);
            setStrategy(
                session.profile.strategy ? session.profile.strategy : '',
            );

            let nextPaymentDate = new Date();
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            setNextPayment(
                session.profile.schedule.payments.filter(
                    (mp: MonthlyPayment) =>
                        mp.month ===
                        `${
                            nextPaymentDate.getMonth() + 1
                        }/${nextPaymentDate
                            .getFullYear()
                            .toString()
                            .substr(2)}`,
                )[0],
            );
        }
    }, [session, firebase, accounts.length, minimumPayment]);

    const onSelectionChanged = (value: string | undefined) => {
        if (!value) {
            return;
        }
        setStrategy(value);
        createSchedule(
            orderAccounts(accounts, strategy),
            minimumPayment +
                Number(monthlyPayment.replace('$', '').replace(',', '')),
            Number(incomeFloat.replace('$', '').replace(',', '')),
            Number(floatFrequency),
        )
            .then((res) => {
                setSchedule(res);

                let nextPaymentDate = new Date();
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                setNextPayment(
                    res.payments.filter(
                        (mp) =>
                            mp.month ===
                            `${
                                nextPaymentDate.getMonth() + 1
                            }/${nextPaymentDate
                                .getFullYear()
                                .toString()
                                .substr(2)}`,
                    )[0],
                );
            })
            .catch((err) => console.error(err));
    };

    const showActionSheet = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: [
                    'Snowball',
                    'Avalanche',
                    'Custom (Ascending)',
                    'Custom (Descending)',
                ],
            },
            (buttonIndex) => {
                let strat;

                switch (buttonIndex) {
                    case 0:
                        strat = 'snowball';
                        break;
                    case 1:
                        strat = 'avalanche';
                        break;
                    case 2:
                        strat = 'customAsc';
                        break;
                    case 3:
                        strat = 'customDesc';
                        break;
                    default:
                        break;
                }

                onSelectionChanged(strat);
            },
        );
    };

    const onSave = () => {
        if (session) {
            session.profile.payment = minimumPayment + Number(monthlyPayment);
            session.profile.float = incomeFloat;
            session.profile.frequency = floatFrequency;
        }

        firebase
            ?.doUpdateUserInfo(session?.user.uid, {
                payment: (minimumPayment + Number(monthlyPayment)).toString(),
                float: incomeFloat,
                frequency: floatFrequency,
            })
            .then(() => setSaveButtonText('Changes Saved'))
            .catch((err) => console.error(err));

        if (!schedule) {
            return;
        }

        firebase
            ?.doSetPaymentSchedule(session?.user.uid, schedule)
            .then(() => {
                if (session) {
                    session.profile.schedule = schedule;
                }
                setSaveButtonText('Changes Saved');
            })
            .catch((err) => console.error(err));

        firebase
            ?.doSetPaymentStrategy(session?.user.uid, strategy)
            .then(() => {
                if (session) {
                    session.profile.strategy = strategy;
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <View style={[globalStyles.container]}>
            <ScrollView>
                <Panel>
                    <View style={globalStyles.splitRow}>
                        <Text>Minimum Payment</Text>
                        <Text>{formatCurrency(minimumPayment)}</Text>
                    </View>
                    <View style={globalStyles.splitRow}>
                        <View style={styles.halfWidth}>
                            <Text style={styles.padToFit}>Extra Payment</Text>
                            <Text style={styles.padToFit}>Income Float</Text>
                            <Text style={styles.padTop}>
                                How Often to Apply Float (in Months)
                            </Text>
                        </View>
                        <View style={styles.halfWidth}>
                            <FormTextInput
                                style={styles.alignRight}
                                value={monthlyPayment}
                                error={monthlyPaymentErrorString}
                                onChangeText={(value) =>
                                    setMonthlyPayment(value)
                                }
                                onBlur={() => setMonthlyPaymentTouched(true)}
                                onSubmitEditing={() => {
                                    if (incomeFloatRef.current) {
                                        incomeFloatRef.current.focus();
                                    }
                                }}
                                placeholder="e.g. $250.00"
                                keyboardType="decimal-pad"
                                returnKeyType="next"
                                blurOnSubmit={constants.IS_IOS}
                            />
                            <FormTextInput
                                style={styles.alignRight}
                                ref={incomeFloatRef}
                                value={incomeFloat}
                                error={incomeFloatErrorString}
                                onChangeText={(value) => setIncomeFloat(value)}
                                onBlur={() => setIncomeFloatTouched(true)}
                                onSubmitEditing={() => {
                                    if (frequencyRef.current) {
                                        frequencyRef.current.focus();
                                    }
                                }}
                                placeholder="e.g. $1500"
                                keyboardType="decimal-pad"
                                returnKeyType="next"
                                blurOnSubmit={constants.IS_IOS}
                            />
                            <FormTextInput
                                style={styles.alignRight}
                                ref={frequencyRef}
                                value={floatFrequency}
                                error={frequencyErrorString}
                                onChangeText={(value) =>
                                    setFloatFrequency(value)
                                }
                                onBlur={() => setFloatFrequencyTouched(true)}
                                onSubmitEditing={() => undefined}
                                placeholder="e.g. 2"
                                keyboardType="number-pad"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                    <View style={globalStyles.splitRow}>
                        <Text>Total Monthly Payment</Text>
                        <Text>
                            {formatCurrency(
                                minimumPayment +
                                    Number(monthlyPayment.replace('$', '')),
                            )}
                        </Text>
                    </View>
                    <View style={globalStyles.splitRow}>
                        <Text>Payment Every {floatFrequency} Months</Text>
                        <Text>
                            {formatCurrency(
                                minimumPayment +
                                    Number(
                                        monthlyPayment
                                            .replace('$', '')
                                            .replace(',', ''),
                                    ) +
                                    Number(
                                        incomeFloat
                                            .replace('$', '')
                                            .replace(',', ''),
                                    ),
                            )}
                        </Text>
                    </View>
                </Panel>
                <Panel style={globalStyles.splitRow}>
                    {/* eslint-disable-next-line react-native/no-inline-styles */}
                    <Text style={{ alignSelf: 'center' }}>
                        Repayment Strategy
                    </Text>
                    <View>
                        {constants.IS_IOS ? (
                            <NativeButton
                                title={
                                    strategy
                                        ? printStrategy(strategy)
                                        : 'Choose Strategy'
                                }
                                onPress={showActionSheet}
                            />
                        ) : (
                            <Picker
                                selectedValue={strategy}
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{ width: 100 }}
                                onValueChange={(value) => {
                                    onSelectionChanged(value.toString());
                                }}>
                                <Picker.Item
                                    label="Snowball"
                                    value="snowball"
                                />
                                <Picker.Item
                                    label="Avalanche"
                                    value="avalanche"
                                />
                                <Picker.Item
                                    label="Custom (Ascending)"
                                    value="customAsc"
                                />
                                <Picker.Item
                                    label="Custom (Descending)"
                                    value="customDesc"
                                />
                            </Picker>
                        )}
                    </View>
                </Panel>
                <Panel>
                    <View style={globalStyles.underline}>
                        <Text style={globalStyles.headerSection}>
                            Monthly Payment Breakdown
                        </Text>
                    </View>
                    {nextPayment &&
                        nextPayment.payments.map((payment, index) => (
                            <View
                                key={index}
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>
                                    {accounts.length > 0 &&
                                        accounts.filter(
                                            (x) => x.id === payment.account,
                                        ).length &&
                                        accounts.filter(
                                            (x) => x.id === payment.account,
                                        )[0].creditor}
                                </Text>
                                <Text>{formatCurrency(payment.amount)}</Text>
                            </View>
                        ))}
                    <Text style={[globalStyles.centered, globalStyles.mt15]}>
                        Months to Finish: {schedule?.monthsToFinish}
                    </Text>
                </Panel>
                <Button text={saveButtonText} onPress={onSave} />
                <View style={styles.buffer} />
            </ScrollView>
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
        height: 200,
    },
    button: {
        marginTop: 15,
        marginHorizontal: 15,
    },
});

export default SettingsScreen;
