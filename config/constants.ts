import { Platform } from 'react-native';

const constants = {
    IS_ANDROID: Platform.OS === 'android',
    IS_IOS: Platform.OS === 'ios',
};

export default constants;
