import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Components
import Dictionary, {
    DictionaryTerm as Term,
    DictionaryDefinition as Definition,
} from '../components/Dictionary';
import { UnorderedList, OrderedList } from '../components/List';
import Panel from '../components/Panel';

// Config
import colors from '../config/colors';
import globalStyles from '../config/styles';

const ResourceScreen = () => {
    const highlightText = (text: string) =>
        text.split(' ').map((word, index) => (
            <Text key={index}>
                <Text style={styles.highlight}>{word} </Text>
                {''}
            </Text>
        ));

    const italicizeText = (text: string) =>
        text.split(' ').map((word, index) => (
            <Text key={index}>
                <Text style={styles.italics}>{word} </Text>
                {''}
            </Text>
        ));

    return (
        <View style={[globalStyles.container]}>
            <ScrollView>
                <Text style={[globalStyles.headerWhite]}>Debt Avalanche</Text>
                <Panel>
                    <Text style={styles.mb10}>
                        This method of repaying multiple debts results in the
                        lowest total interest cost by prioritizing the repayment
                        of debts with the highest interest rates, while paying
                        the minimum amounts for each other debt. This continues
                        like an avalanche, where the highest interest rate debt
                        tumbles down to the next highest interest rate debt,
                        until every debt is finally paid off and the avalanche
                        is over. For instance, a credit card with an 18%
                        interest rate will receive priority over a 5% mortgage
                        or 12% personal loan, regardless of the balance due for
                        each. This method pays off debts with the least total
                        interest. The calculator uses this method, and in the
                        results, debts will be ordered from top to bottom
                        starting with the highest interest rates first.
                    </Text>
                    <Text style={styles.mb10}>
                        Pay off the highest interest debt first and then in
                        order descending. If they are equal use the one that has
                        the higher balance first
                    </Text>
                    <Text>
                        The quickest way to retire your debt is to 1) determine
                        what your total debt payment is now, then 2) sort your
                        debts from highest interest rate to lowest, then 3)
                        continue to make the same total payment amount except
                        pay Minimum Payments on all debts except the highest
                        rate debt, then 4) once the highest rate debt is paid
                        off apply those new savings to the next highest rate
                        debt and so on. Use this calculator to determine the
                        interest and time saved using this 'Roll-Over' technique
                        along with the potential increase in savings once all
                        the debts have been paid off. The calculator will sort
                        the debts for you when completing the analysis. You may
                        also apply an extra amount to the total payment to
                        accelerate debt payoff even further.
                    </Text>
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    The Snowball Debt Payoff System
                </Text>
                <Panel>
                    <Text style={styles.mb10}>
                        While the avalanche system favors speed and mathematics,
                        the snowball system looks to the psychological aspect of
                        debt servicing. Paying off debts can be mentally
                        exhausting because they never seem to go away. A
                        significant downside for people who use the avalanche
                        system is that large loans can take a long time to pay
                        off. In the first few months, progress might even seem
                        insignificant.
                    </Text>
                    <Text style={styles.mb10}>
                        What the snowball system aims to do is psych you up for
                        paying your debts by having you pay off the smallest
                        ones first. A lot of people ignore the smaller debts
                        because the inertia of bigger debts cripples them. The
                        human mind is an illogical place and having multiple
                        loans will often look worse than having one larger, more
                        expensive loan. Getting quicker results when paying off
                        debts can, however, provide the motivation you need to
                        clear your tab.
                    </Text>
                    <Text>
                        This strategy does not account for the interest rates on
                        your loans but instead looks at the principal amount.
                        The idea is to clear out small debts quickly. Depending
                        on your financial situation, you might even be able to
                        take out one or two bills within a month. The motivation
                        you derive form clearing out a bill can be channeled
                        towards paying off the next smallest one.
                    </Text>
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Debt Free APP
                </Text>
                <Panel>
                    <UnorderedList
                        items={[
                            'Debt Free Consultation',
                            'Debt Free APP',
                            'You can use this with your logo',
                            'We can create an app just for your Brand',
                            'Avalanche and Snowball Methods',
                            'Shows when they will be debt free',
                        ]}
                    />
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Financial Definitions
                </Text>
                <Panel>
                    <Dictionary>
                        <Term>Debt-Free Date</Term>
                        <Definition>
                            <Text>
                                This is the month you'll be done paying the
                                debt. The more you pay monthly, the faster
                                you'll be out of debt.
                            </Text>
                        </Definition>
                        <Term>Debt Payoff Order</Term>
                        <Definition>
                            <Text>
                                You'll see a list of your accounts with
                                principal, principal, total interest, and
                                debt-free date under your current minimum
                                payments and a new plan with the extra money
                                toward your debt. This could change depending on
                                the payoff method of debt avalanche or debt
                                snowball.
                            </Text>
                        </Definition>
                        <Term>Home Equity Line of Credit (HELOC)</Term>
                        <Definition>
                            <Text>
                                A line of credit secured by the equity in a
                                consumer's home. It can be used for home
                                improvements, debt consolidation, and other
                                major purchases. Interest paid on the loan is
                                generally tax deductible (consult a tax advisor
                                to be sure). The funds may be accessed by
                                writing checks against the line of credit or by
                                getting a cash advance.
                            </Text>
                        </Definition>
                        <Term>Income Float</Term>
                        <Definition>
                            <Text style={styles.mb10}>
                                Add the to formula a two-month float. Using an
                                income of $5,000:
                            </Text>
                            <Text style={styles.mb10}>
                                Month one: the client puts the entire month's
                                pay into the savings. Use the LOC to pay the
                                bills that month.
                            </Text>
                            <Text style={styles.mb10}>
                                Month two: Pay the LOC when the bill comes due,
                                then pay $4,000 on the highest interest account.
                                Live off the LOC.
                            </Text>
                            <Text>
                                Then the cycle starts again, repeating every two
                                months.
                            </Text>
                        </Definition>
                        <Term>Line of Credit</Term>
                        <Definition>
                            <Text>
                                A pre-approved loan authorization with a
                                specific borrowing limit based on
                                creditworthiness. A line of credit allows
                                borrowers to obtain a number of loans without
                                re-applying each time as long as the total of
                                borrowed funds does not exceed the credit limit.
                            </Text>
                        </Definition>
                        <Term>Minimum Balance</Term>
                        <Definition>
                            <Text>
                                The amount of money required to be on deposit in
                                an account to qualify the depositor for special
                                services or to waive a service charge.
                            </Text>
                        </Definition>
                        <Term>Open-End Credit</Term>
                        <Definition>
                            <Text>
                                A credit agreement (typically a credit card)
                                that allows a customer to borrow against a
                                pre-approved credit line when purchasing goods
                                and services. The borrower is only billed for
                                the amount that is actually borrows plus any
                                interest due. (Also called a charge account or
                                revolving credit)
                            </Text>
                        </Definition>
                        <Term>Payment Due Date</Term>
                        <Definition>
                            <Text>
                                The date on which a loan or installment payment
                                is due. It is set by a financial institution.
                                Any payment received after this date is
                                considered late; fees and penalties can be
                                assessed.
                            </Text>
                        </Definition>
                        <Term>Payoff</Term>
                        <Definition>
                            <Text>
                                The complete repayment of a loan, including
                                principal, interest, and any other amounts due.
                                Payoff occurs either over the full term of the
                                loan or through prepayments.
                            </Text>
                        </Definition>
                        <Term>Prepayment Penalty</Term>
                        <Definition>
                            <Text>
                                A penalty imposed on a borrower for repaying the
                                loan before its due date. In the case of a
                                mortgage, this applies when there is not a
                                prepayment clause in the mortgage note to offset
                                the penalty.
                            </Text>
                        </Definition>
                        <Term>Revolving Credit</Term>
                        <Definition>
                            <Text>
                                A credit agreement (typically a credit card)
                                that a allows a customer to borrow against a
                                pre-approved credit line when purchasing goods
                                and services. The borrower is only billed for
                                the amount that is actually borrowed plus any
                                interest due. (Also called a charge account or
                                open-end credit.)
                            </Text>
                        </Definition>
                        <Term>Total Monthly Payment</Term>
                        <Definition>
                            <Text>
                                You'll see your current minimum monthly payments
                                as well as your new monthly payments with the
                                extra money you put toward your debt.
                            </Text>
                        </Definition>
                        <Term>Total Interest</Term>
                        <Definition>
                            <Text>
                                Here you'll see how much interest you'd pay over
                                the course of repaying the debt. See the
                                difference in interest between your current plan
                                and the new plan with your additional payment
                                amount.
                            </Text>
                        </Definition>
                    </Dictionary>
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Marketing
                </Text>
                <Panel>
                    <UnorderedList
                        items={[
                            'Set yourself apart from your competition',
                            'Set appointments easier (Everyone wants to talk about getting out of debt and saving for retirement)',
                            'You can offer as a Free Service',
                            'You can charge as much as you want (Sometimes when you charge higher amounts, they perceive you are more of an expert',
                            'Facebook, Blogging, Twitter, OTO Conversion, List Building, Sales Funnel, and Virtual Marketing',
                            'Content Creation',
                            'Website Training',
                            'Sales funnel creation (lead making machine)',
                        ]}
                    />
                </Panel>
                <Text style={[globalStyles.headerWhite, globalStyles.mt15]}>
                    Time to Change the Way You Think...
                </Text>
                <Panel>
                    <Text style={styles.mb10}>
                        Rich people {italicizeText('acquire assets')}. The poor
                        and middle class acquire liabilities that they think are
                        assets.
                    </Text>
                    <Text style={[styles.mb10, styles.underline]}>
                        {highlightText('Rule #1:')}
                    </Text>
                    <Text style={styles.mb10}>
                        You must know the difference between an asset and a
                        liability, and buy assets.
                    </Text>
                    <UnorderedList
                        items={[
                            'Asset puts money in my pocket.',
                            'Liability takes money out of my pocket.',
                        ]}
                    />
                    <Text style={styles.mb10}>
                        An asset is something that puts money in my pocket
                        whether I work or not. A liability is something that
                        takes money out of my pocket. This This is really all
                        you need to know. If you want to be rich, simply spend
                        your life buying or building assets. If you want to be
                        poor or middle class, spend your life buying
                        liabilities.
                    </Text>
                    <Text style={styles.mb10}>
                        When I want a bigger house, I first buy assets that will
                        generate the cash flow to pay for the house.
                    </Text>
                    <Text style={[styles.mb10, styles.underline]}>
                        {highlightText('Why the Middle-Class Struggle?')}
                    </Text>
                    <Text style={styles.mb10}>
                        The middle class finds itself in a constant state of
                        financial struggle. Their primary income is through
                        their salary. As their wages increase, so do their
                        taxes. Their expenses tend ot increase in proportion to
                        their salary increase: hence, the phrase "the Rat Race."
                        They treat their home as the primary asset, instead of
                        investing in income-producing assets.
                    </Text>
                    <OrderedList
                        items={[
                            "You work for the company. Employees make their business owner or the shareholders rich, not themselves. Your efforts and success will help provide for the owner's success and retirement.",
                            'You work for the government. The government takes its share from your paycheck before you even see it. By working harder, you simply increase the amount of taxes taken by the government. Most people work from January to May just for the government.',
                            'You work for the bank. After taxes, your next largest expense is usually your mortgage and credit card debt.',
                        ]}
                    />
                    <Text style={[styles.mb10, styles.underline]}>
                        {highlightText('Principal')}
                    </Text>
                    <Text>
                        Wealth is a person's ability to survive so many number
                        of days forward &ndash; or, if I stopped working today,
                        how long could I survive?
                    </Text>
                </Panel>
                <View style={styles.buffer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    buffer: {
        height: 200,
    },
    mb5: {
        marginBottom: 5,
    },
    mb10: {
        marginBottom: 10,
    },
    highlight: {
        backgroundColor: 'yellow',
    },
    italics: {
        fontStyle: 'italic',
    },
    underline: {
        textDecorationStyle: 'solid',
        textDecorationColor: colors.CHARCOAL,
        textDecorationLine: 'underline',
    },
});

export default ResourceScreen;
