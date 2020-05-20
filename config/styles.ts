import { StyleSheet, Dimensions } from 'react-native';
import colors from './colors';

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.GREEN,
        justifyContent: 'center',
        zIndex: -1,
    },
    centered: {
        textAlign: 'center',
    },
    centeredRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    font15: {
        fontSize: 15,
    },
    font20: {
        fontSize: 20,
    },
    headerSection: {
        fontSize: 20,
        textAlign: 'center',
    },
    headerWhite: {
        fontSize: 35,
        fontWeight: 'bold',
        color: colors.WHITE,
        textAlign: 'center',
    },
    mt5: {
        marginTop: 5,
    },
    mt10: {
        marginTop: 10,
    },
    mt15: {
        marginTop: 15,
    },
    splitRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    underline: {
        borderBottomColor: colors.CHARCOAL,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default styles;
