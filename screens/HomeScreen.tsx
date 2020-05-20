import React, { useState, useEffect, useContext } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import { Bar as ProgressBar, Circle } from 'react-native-progress';

// Config
import colors from '../config/colors';
import { printStrategy, formatCurrency } from '../config/functions';
import globalStyles from '../config/styles';
import { AccountFlat, MonthlyPayment, Payment } from '../config/types';

// Services
import { SessionContext } from '../services/session';
import { FirebaseContext } from '../services/firebase';

// Components
import Panel from '../components/Panel';

const LoadingScreen = () => {
    const insets = useSafeArea();
    return (
        <View
            style={[
                globalStyles.container,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                    paddingTop: insets.top,
                    paddingBottom: insets.bottom,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
            ]}>
            <Circle
                color={colors.WHITE}
                size={100}
                borderWidth={5}
                indeterminate={true}
            />
        </View>
    );
};

const HomeScreen = () => {
    const insets = useSafeArea();
    const session = useContext(SessionContext);
    const firebase = useContext(FirebaseContext);

    const [loading, setLoading] = useState(true);
    const [refreshing] = useState(false);

    const [accounts, setAccounts] = useState<Array<AccountFlat>>([]);

    const [debt, setDebt] = useState(0);
    const [interest, setInterest] = useState(0);
    const [total, setTotal] = useState(0);
    const [totalPaidToDate, setTotalPaidToDate] = useState(0);

    const [payments, setPayments] = useState<Array<MonthlyPayment>>([]);
    const [nextPayment, setNextPayment] = useState<MonthlyPayment | null>(null);

    const [progressBarValue, setProgressBarValue] = useState(0);

    useEffect(() => {
        if (session && session.profile && session.user) {
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
            setTimeout(() => setLoading(false), 1000);

            setDebt(session.profile.schedule?.debt);
            setInterest(session.profile.schedule?.interest);
            setTotal(session.profile.schedule?.total);

            let pmts = session.profile.schedule?.payments;

            // mp = monthlyPayment
            // p = payment
            // p2a = paymentToAccount
            // acc = accumulator
            // a = amount
            // mt = monthlyTotal
            if (pmts.filter((x: MonthlyPayment) => x.paid).length > 0) {
                let amtPaid = pmts
                    .filter((mp: MonthlyPayment) => mp.paid)
                    .map((mp: MonthlyPayment) => mp.payments)
                    .map((p: Array<Payment>) =>
                        p.map((p2a) => p2a.amount).reduce((acc, a) => acc + a),
                    )
                    .reduce((acc: number, mt: number) => acc + mt);
                setTotalPaidToDate(amtPaid);
            }
            setPayments(pmts);
            let nextPaymentDate = new Date();
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            setNextPayment(
                pmts.filter(
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

        if (total) {
            if (totalPaidToDate < total) {
                setProgressBarValue(totalPaidToDate / total);
            } else {
                setProgressBarValue(100);
            }
        } else {
            setProgressBarValue(0);
        }
    }, [
        total,
        totalPaidToDate,
        session,
        accounts.length,
        firebase,
        payments,
        refreshing,
        loading,
    ]);

    const onRefresh = React.useCallback(() => {
        setLoading(true);
        setAccounts([]);
    }, []);

    const toggleSwitch = () => {
        if (
            !nextPayment ||
            !(
                session &&
                session.profile &&
                session.profile.schedule &&
                session.user
            ) ||
            !firebase
        ) {
            return;
        }

        let paid = !nextPayment.paid;

        let rec = {
            ...nextPayment,
            paid,
        };

        let amount = nextPayment.payments
            .map((x) => x.amount)
            .reduce((acc, x) => acc + x);

        setNextPayment(rec);
        let p = payments;
        p.splice(p.indexOf(nextPayment), 1, rec);
        setPayments(p);
        session.profile.schedule.payments = p;

        firebase
            .doSetPaymentSchedule(session.user.uid, session.profile.schedule)
            .then(() =>
                setTotalPaidToDate(totalPaidToDate + (paid ? amount : -amount)),
            )
            .catch((err) => console.error(err));
    };

    const NoAccts = () => {
        return (
            <Panel>
                <Text>
                    Looks like you don't have any account data entered yet.
                    Accounts can be entered on the Accounts tab.
                </Text>
            </Panel>
        );
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <View
            style={[
                globalStyles.container,
                { paddingTop: insets.top, paddingBottom: insets.bottom * 2 },
            ]}>
            {!accounts.length ? (
                <NoAccts />
            ) : (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>
                    <Panel>
                        <View
                            style={[
                                globalStyles.splitRow,
                                globalStyles.mt5,
                                globalStyles.underline,
                                // eslint-disable-next-line react-native/no-inline-styles
                                { paddingBottom: 5 }
                            ]}>
                            <Text>Debt</Text>
                            <Text>{formatCurrency(debt)}</Text>
                        </View>
                        <View
                            style={[
                                globalStyles.splitRow,
                                globalStyles.mt5,
                                globalStyles.underline,
                                // eslint-disable-next-line react-native/no-inline-styles
                                { paddingBottom: 5}
                            ]}>
                            <Text>Interest</Text>
                            <Text>{formatCurrency(interest)}</Text>
                        </View>
                        <View style={[globalStyles.splitRow, globalStyles.mt5]}>
                            <Text>Total Repayment</Text>
                            <Text>{formatCurrency(total)}</Text>
                        </View>
                    </Panel>
                    <Panel style={globalStyles.splitRow}>
                        <Text>Repayment Strategy</Text>
                        <Text style={styles.strategy}>
                            {session &&
                                session.profile &&
                                printStrategy(session.profile.strategy)}
                        </Text>
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
                                    <Text>
                                        {formatCurrency(payment.amount)}
                                    </Text>
                                </View>
                            ))}
                        <Text
                            style={[globalStyles.centered, globalStyles.mt15]}>
                            Months to Finish:{' '}
                            {session?.profile?.schedule?.monthsToFinish}
                        </Text>
                    </Panel>
                    <Panel>
                        <Text style={styles.headerBig}>Upcoming Payment</Text>
                        <Text style={styles.bigDate}>
                            {nextPayment ? nextPayment?.month : 'X/XX'}
                        </Text>
                        <View style={globalStyles.centeredRow}>
                            <Switch
                                trackColor={{
                                    false: colors.CHARCOAL,
                                    true: colors.GREEN,
                                }}
                                ios_backgroundColor={colors.CHARCOAL}
                                value={nextPayment ? nextPayment.paid : false}
                                onValueChange={toggleSwitch}
                            />
                            <Text style={globalStyles.font20}> Paid</Text>
                        </View>
                        <ProgressBar
                            color={colors.GREEN}
                            progress={progressBarValue}
                            width={null}
                            height={15}
                            borderRadius={10}
                            style={globalStyles.mt15}
                        />
                        <Text style={[globalStyles.centered, globalStyles.mt5]}>
                            Total Paid To Date:{' '}
                            {formatCurrency(totalPaidToDate)}
                        </Text>
                    </Panel>
                    <View style={styles.buffer} />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    bigDate: {
        fontSize: 75,
        textAlign: 'center',
    },
    buffer: {
        height: 100,
    },
    headerBig: {
        fontSize: 35,
        textAlign: 'center',
    },
    strategy: {
        color: colors.GREEN,
    },
    triFrame: {
        flexDirection: 'row',
    },
    triFrameSection: {
        flex: 2,
    },
    triFrameSectionBig: {
        flex: 3,
        borderLeftColor: colors.CHARCOAL,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderRightColor: colors.CHARCOAL,
        borderRightWidth: StyleSheet.hairlineWidth,
    },
});

export default HomeScreen;
