import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import axios from 'axios';
import { User } from 'firebase';
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
import globalStyles from '../config/styles';

// Services
import { FirebaseContext } from '../services/firebase';
import { SessionContext } from '../services/session';

type UserStackParamList = {
    Management: undefined;
    EditUser: {
        index?: number;
        user?: User;
        users: Array<User>;
        setUsers: (users: Array<User>) => void;
        trigger: boolean;
        setTrigger: (value: boolean) => void;
        newUser?: boolean;
    };
};

type EditScreenRouteProp = RouteProp<UserStackParamList, 'EditUser'>;

type EditScreenNavigationProp = StackNavigationProp<
    UserStackParamList,
    'EditUser'
>;

type Props = {
    route: EditScreenRouteProp;
    navigation: EditScreenNavigationProp;
};

const EditUserScreen = ({ route, navigation }: Props) => {
    const session = useContext(SessionContext);

    const {
        index,
        user,
        users,
        setUsers,
        trigger,
        setTrigger,
        newUser,
    } = route.params;

    const [uid, setUid] = useState('');
    const [email, setEmail] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const emailRef = React.createRef<FormTextInput>();
    const passwordRef = React.createRef<FormTextInput>();
    const nameRef = React.createRef<FormTextInput>();
    const phoneRef = React.createRef<FormTextInput>();

    const [token, setToken] = useState('');
    const [saveButtonText, setSaveButtonText] = useState('Save Changes');

    useEffect(() => {
        if (session && session.user) {
            session.user
                .getIdToken()
                .then((t) => setToken(t))
                .catch((err) => console.log(err));

            setUid(user?.uid ? user.uid : '');
            setEmail(user?.email ? user.email : '');
            setDisplayName(user?.displayName ? user.displayName : '');
            setPhone(user?.phoneNumber ? user.phoneNumber : '');
        }
    }, [session, user]);

    const onSubmit = () => {
        setSaveButtonText('Saving...');
        if (newUser) {
            axios
                .post(
                    'https://debt2wealthcalc-git-master.anthonyutt.now.sh/api/users',
                    {
                        data: {
                            token,
                            uid,
                            email,
                            password,
                            displayName,
                            phone: phone ? phone : undefined,
                        },
                    },
                )
                .then((res) => {
                    let userNew: User = res.data;
                    let oldUsers = users.concat(userNew);
                    setUsers(oldUsers);
                    navigation.goBack();
                })
                .catch((err) => console.log(err));
        } else {
            axios
                .put(
                    `https://debt2wealthcalc-git-master.anthonyutt.now.sh/api/users/${user?.uid}`,
                    {
                        data: {
                            token,
                            email,
                            displayName,
                            phone,
                        },
                    },
                )
                .then((res) => {
                    let userNew: User = res.data;
                    let oldUsers = users;
                    oldUsers.splice(
                        typeof index !== 'undefined' ? index : users.length,
                        1,
                        userNew,
                    );
                    setUsers(oldUsers);
                    setTrigger(!trigger);
                    navigation.goBack();
                })
                .catch((err) => console.log(err));
        }
    };

    const onDelete = () => {
        if (!newUser && index) {
            axios
                .delete(
                    `https://debt2wealthcalc-git-master.anthonyutt.now.sh/api/users/${user?.uid}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    },
                )
                .then(() => {
                    let oldUsers = users;
                    oldUsers.splice(index, 1);
                    setUsers(oldUsers);
                    setTrigger(!trigger);
                    navigation.goBack();
                })
                .catch((err) => console.log(err));
        }
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Panel>
                    <View style={globalStyles.splitRow}>
                        <View style={styles.halfWidth}>
                            {newUser && (
                                <Text style={styles.padToFit}>User ID</Text>
                            )}
                            <Text style={styles.padToFit}>Email</Text>
                            {newUser && (
                                <Text style={styles.padToFit}>Password</Text>
                            )}
                            <Text style={styles.padToFit}>Name</Text>
                            <Text style={styles.padTop}>Phone</Text>
                        </View>
                        <View style={styles.halfWidth}>
                            {newUser && (
                                <FormTextInput
                                    value={uid}
                                    onChangeText={(value) => setUid(value)}
                                    onSubmitEditing={() => {
                                        if (emailRef.current) {
                                            emailRef.current.focus();
                                        }
                                    }}
                                    placeholder="User ID"
                                    returnKeyType="next"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            )}
                            <FormTextInput
                                value={email}
                                ref={emailRef}
                                onChangeText={(value) => setEmail(value)}
                                onSubmitEditing={() => {
                                    if (newUser) {
                                        if (passwordRef.current) {
                                            passwordRef.current.focus();
                                        }
                                    } else {
                                        if (nameRef.current) {
                                            nameRef.current.focus();
                                        }
                                    }
                                }}
                                placeholder="Email"
                                returnKeyType="next"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {newUser && (
                                <FormTextInput
                                    ref={passwordRef}
                                    value={password}
                                    onChangeText={(value) => setPassword(value)}
                                    onSubmitEditing={() => {
                                        if (nameRef.current) {
                                            nameRef.current.focus();
                                        }
                                    }}
                                    placeholder="Password"
                                    returnKeyType="next"
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            )}
                            <FormTextInput
                                ref={nameRef}
                                value={displayName}
                                onChangeText={(value) => setDisplayName(value)}
                                onSubmitEditing={() => {
                                    if (phoneRef.current) {
                                        phoneRef.current.focus();
                                    }
                                }}
                                placeholder="Name"
                                returnKeyType="next"
                                autoCapitalize="words"
                                autoCorrect={false}
                            />
                            <FormTextInput
                                ref={phoneRef}
                                value={phone}
                                onChangeText={(value) => setPhone(value)}
                                placeholder="Phone"
                                keyboardType="phone-pad"
                                returnKeyType="done"
                            />
                        </View>
                    </View>
                    {!newUser && (
                        <Button
                            text="Delete User"
                            onPress={onDelete}
                            variant="danger"
                        />
                    )}
                    <Button text={saveButtonText} onPress={onSubmit} />
                </Panel>
            </ScrollView>
        </View>
    );
};

const ManagementScreen = () => {
    const session = useContext(SessionContext);
    const firebase = useContext(FirebaseContext);
    const navigation = useNavigation();

    const [users, setUsers] = useState<Array<User>>();
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        if (session && session.user) {
            firebase?.auth.currentUser
                ?.getIdToken()
                .then((token) => {
                    axios
                        .get(
                            'https://debt2wealthcalc-git-master.anthonyutt.now.sh/api/users',
                            {
                                headers: {
                                    Authorization: token,
                                },
                                withCredentials: true,
                            },
                        )
                        .then((res) => setUsers(res.data))
                        .catch((err) => console.log(err));
                })
                .catch((err) => console.error(err));
        }
    }, [firebase, session]);

    const editUser = (index: number) => {
        if (users) {
            let currUser = users[index];

            navigation.navigate('EditUser', {
                index,
                user: currUser,
                users,
                setUsers,
                trigger,
                setTrigger,
                newUser: false,
            });
        }
    };

    const addUser = () => {
        if (users) {
            navigation.navigate('EditUser', {
                users,
                setUsers,
                trigger,
                setTrigger,
                newUser: true,
            });
        }
    };

    return (
        <View style={globalStyles.container}>
            <ScrollView>
                <Button text="Add New User" onPress={addUser} />
                {!users?.length ? (
                    <Panel>
                        <Text>Loading Users...</Text>
                    </Panel>
                ) : (
                    users?.map((user, index) => (
                        <CollapsiblePanel
                            key={index}
                            header={
                                <View style={[globalStyles.splitRow]}>
                                    <Text style={[globalStyles.headerSection]}>
                                        User ID
                                    </Text>
                                    <Text style={[globalStyles.headerSection]}>
                                        {user.uid}
                                    </Text>
                                </View>
                            }>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Email</Text>
                                <Text>{user.email}</Text>
                            </View>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Name</Text>
                                {user.displayName ? (
                                    <Text>{user.displayName}</Text>
                                ) : (
                                    <Text style={styles.faded}>Empty</Text>
                                )}
                            </View>
                            <View
                                style={[
                                    globalStyles.splitRow,
                                    globalStyles.mt5,
                                ]}>
                                <Text>Phone</Text>
                                {user.phoneNumber ? (
                                    <Text>{user.phoneNumber}</Text>
                                ) : (
                                    <Text style={styles.faded}>Empty</Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => editUser(index)}>
                                <Text
                                    style={[
                                        globalStyles.centered,
                                        styles.link,
                                    ]}>
                                    Edit User Information
                                </Text>
                            </TouchableOpacity>
                        </CollapsiblePanel>
                    ))
                )}
                <View style={styles.buffer} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    buffer: {
        height: 200,
    },
    faded: {
        color: colors.MID_GRAY,
    },
    halfWidth: {
        width: '50%',
    },
    link: {
        marginTop: 15,
        color: colors.BLUE,
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
});

const Stack = createStackNavigator();

const Screens = () => {
    return (
        <Stack.Navigator initialRouteName="Management">
            <Stack.Screen name="Management" component={ManagementScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
        </Stack.Navigator>
    );
};

export default Screens;
