import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';

// Components
import CollapsiblePanel from '../components/CollapsiblePanel';
import FormTextInput from '../components/FormTextInput';
import Panel from '../components/Panel';

// Config
import colors from '../config/colors';
import constants from '../config/constants';
import { formatCurrency } from '../config/functions';
import globalStyles from '../config/styles';
import { InvestmentSchedule } from '../config/types';

// Services
import { SessionContext } from '../services/session';
import { createSchedule } from '../services/investment';

const InvestmentScreen = () => {
    const insets = useSafeArea();
    const session = useContext(SessionContext);

    const [payment, setPayment] = useState(0);
    const [float, setFloat] = useState(0);
    const [frequency, setFrequency] = useState(0);

    const [schedule, setSchedule] = useState<InvestmentSchedule>();

    const [currAge, setCurrAge] = useState('20');
    const [retireAge, setRetireAge] = useState('65');
    const [rate, setRate] = useState('4%');

    const [currAgeTouched, setCurrAgeTouched] = useState(false);
    const [retireAgeTouched, setRetireAgeTouched] = useState(false);
    const [rateTouched, setRateTouched] = useState(false);

    const currAgeError =
        currAgeTouched && currAge !== '' && isNaN(+currAge)
            ? 'Must be a number'
            : undefined;

    const retireAgeError =
        retireAgeTouched && retireAge !== '' && isNaN(+retireAge)
            ? 'Must be a number'
            : undefined;

    const rateError =
        rateTouched && rate !== '' && isNaN(+rate.replace('%', ''))
            ? 'Must be a percentage'
            : undefined;

    const retirementRef = React.createRef<FormTextInput>();
    const rateRef = React.createRef<FormTextInput>();

    useEffect(() => {
        if (session) {
            if (session.profile && session.profile.payment) {
                setPayment(Number(session.profile.payment));
                setFloat(Number(session.profile.float));
                setFrequency(Number(session.profile.frequency));
            }
        }

        setSchedule(
            createSchedule(
                Number(retireAge) - Number(currAge),
                Number(rate.replace('%', '')) / 100,
                payment,
                float,
                frequency,
            ),
        );
    }, [session, currAge, retireAge, payment, float, frequency, rate]);

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
                            <Text style={styles.padToFit}>Current Age</Text>
                            <Text style={styles.padToFit}>Retirement Age</Text>
                            <Text style={styles.padTop}>Interest Rate</Text>
                        </View>
                        <View style={styles.halfWidth}>
                            <FormTextInput
                                value={currAge}
                                error={currAgeError}
                                onChangeText={(value) => setCurrAge(value)}
                                onBlur={() => setCurrAgeTouched(true)}
                                onSubmitEditing={() => {
                                    if (retirementRef.current) {
                                        retirementRef.current.focus();
                                    }
                                }}
                                placeholder="Current Age"
                                keyboardType="number-pad"
                                returnKeyType="next"
                                blurOnSubmit={constants.IS_IOS}
                            />
                            <FormTextInput
                                ref={retirementRef}
                                value={retireAge}
                                error={retireAgeError}
                                onChangeText={(value) => setRetireAge(value)}
                                onBlur={() => setRetireAgeTouched(true)}
                                onSubmitEditing={() => {
                                    if (rateRef.current) {
                                        rateRef.current.focus();
                                    }
                                }}
                                placeholder="Retirement Age"
                                keyboardType="number-pad"
                                returnKeyType="next"
                                blurOnSubmit={constants.IS_IOS}
                            />
                            <FormTextInput
                                ref={rateRef}
                                value={rate}
                                error={rateError}
                                onChangeText={(value) => setRate(value)}
                                onBlur={() => setRateTouched(true)}
                                placeholder="Interest Rate"
                                keyboardType="decimal-pad"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                    <View style={globalStyles.splitRow}>
                        <Text>Investment Period</Text>
                        <Text>{Number(retireAge) - Number(currAge)} years</Text>
                    </View>
                </Panel>
                <Panel>
                    {schedule && (
                        <View>
                            <Text style={globalStyles.headerSection}>
                                Investment Summary
                            </Text>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Total Principal</Text>
                                <Text>
                                    {formatCurrency(schedule.summary.principal)}
                                </Text>
                            </View>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Total Interest</Text>
                                <Text>
                                    {formatCurrency(schedule.summary.interest)}
                                </Text>
                            </View>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Final Value</Text>
                                <Text>
                                    {formatCurrency(schedule.summary.value)}
                                </Text>
                            </View>
                        </View>
                    )}
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Investment Timeline
                </Text>
                {schedule &&
                    schedule.years.map((year, index) => (
                        <CollapsiblePanel
                            key={index}
                            header={
                                <View style={globalStyles.splitRow}>
                                    <Text style={globalStyles.headerSection}>
                                        Year {index + 1}
                                    </Text>
                                    <Text style={globalStyles.headerSection}>
                                        {formatCurrency(year.totalValue)}
                                    </Text>
                                </View>
                            }>
                            <View>
                                <View style={globalStyles.splitRow}>
                                    <Text style={globalStyles.mt5}>
                                        Principal Added
                                    </Text>
                                    <Text style={globalStyles.mt5}>
                                        {formatCurrency(year.principal)}
                                    </Text>
                                </View>
                                <View style={globalStyles.splitRow}>
                                    <Text style={globalStyles.mt5}>
                                        Interest Added
                                    </Text>
                                    <Text style={globalStyles.mt5}>
                                        {formatCurrency(year.interest)}
                                    </Text>
                                </View>
                                <View style={globalStyles.splitRow}>
                                    <Text style={globalStyles.mt5}>
                                        Total Added
                                    </Text>
                                    <Text style={globalStyles.mt5}>
                                        {formatCurrency(year.totalAdded)}
                                    </Text>
                                </View>
                                <View style={globalStyles.splitRow}>
                                    <Text style={globalStyles.mt5}>
                                        Total Account Value
                                    </Text>
                                    <Text style={globalStyles.mt5}>
                                        {formatCurrency(year.totalValue)}
                                    </Text>
                                </View>
                            </View>
                        </CollapsiblePanel>
                    ))}
                <View style={styles.buffer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    halfWidth: {
        width: '50%',
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
        height: 100,
    },
});

export default InvestmentScreen;
