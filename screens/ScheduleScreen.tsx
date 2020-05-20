import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// Components
import CollapsiblePanel from '../components/CollapsiblePanel';

// Config
import colors from '../config/colors';
import { formatCurrency } from '../config/functions';
import globalStyles from '../config/styles';
import { AccountFlat, Schedule } from '../config/types';

// Services
import { FirebaseContext } from '../services/firebase';
import { SessionContext } from '../services/session';

const ScheduleScreen = () => {
    const insets = useSafeArea();
    const firebase = useContext(FirebaseContext);
    const session = useContext(SessionContext);

    const [accounts, setAccounts] = useState<Array<AccountFlat>>([]);
    const [schedule, setSchedule] = useState<Schedule>();

    useEffect(() => {
        if (session && session.profile && session.profile.schedule) {
            if (!accounts.length) {
                firebase
                    ?.doGetUserDetailRecords(session.user.uid)
                    .then((docs) => {
                        docs.forEach((doc) => {
                            setAccounts((accts) =>
                                accts.concat({
                                    id: doc.id,
                                    creditor: doc.data().creditor,
                                    balance: doc.data().balance,
                                    rate: doc.data().rate,
                                    payment: doc.data().payment,
                                    custom: doc.data().custom,
                                }),
                            );
                        });
                    })
                    .catch((err) => console.error(err));
            }

            setSchedule(session.profile.schedule);
        }
    }, [session, accounts.length, firebase]);

    return (
        <View
            style={[
                globalStyles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}>
            <View>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Repayment Schedule
                </Text>
                <Text style={styles.tip}>Tap to Expand</Text>
            </View>
            <ScrollView>
                {schedule &&
                    schedule.payments.map((payment, index) => (
                        <CollapsiblePanel
                            key={index}
                            header={
                                <View style={[globalStyles.splitRow]}>
                                    <Text style={globalStyles.headerSection}>
                                        {payment.month}
                                    </Text>
                                    <Text style={globalStyles.headerSection}>
                                        {formatCurrency(
                                            payment.payments
                                                .map((p) => p.amount)
                                                .reduce((acc, x) => acc + x),
                                        )}
                                    </Text>
                                </View>
                            }>
                            <View>
                                {payment.payments.map((p, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            globalStyles.splitRow,
                                            globalStyles.mt15,
                                        ]}>
                                        <Text>
                                            {accounts.length > 0 &&
                                                accounts.filter(
                                                    (x) => x.id === p.account,
                                                ).length &&
                                                accounts.filter(
                                                    (x) => x.id === p.account,
                                                )[0].creditor}
                                        </Text>
                                        <Text>{formatCurrency(p.amount)}</Text>
                                    </View>
                                ))}
                            </View>
                        </CollapsiblePanel>
                    ))}
                <View style={styles.buffer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    buffer: {
        height: 100,
    },
    flex: {
        flex: 1,
    },
    strategy: {
        color: colors.GREEN,
    },
    tip: {
        color: colors.WHITE,
        textAlign: 'center',
    },
});

export default ScheduleScreen;
