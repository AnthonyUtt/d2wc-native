import React, { useState, useEffect, useContext } from 'react';
import { FirebaseContext } from '../firebase';

import { SessionContext } from './context';

const Session = (props) => {
    const firebase = useContext(FirebaseContext);

    const [user, setUser] = useState(null);

    useEffect(() => {
        var listener = firebase?.auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                firebase
                    .doGetUserInfo(authUser.uid)
                    .then((doc) => {
                        setUser((prevState) => ({
                            ...prevState,
                            profile: doc.data(),
                        }));
                    })
                    .catch((err) => console.error(err));

                setUser((prevState) => ({
                    ...prevState,
                    user: authUser,
                }));
            } else {
                setUser(null);
            }
        });

        return () => {
            listener();
        };
    }, [firebase]);

    return (
        <SessionContext.Provider value={user}>
            {props.children}
        </SessionContext.Provider>
    );
};

export default Session;
