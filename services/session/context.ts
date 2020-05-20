import React from 'react';

export interface User {
    user: firebase.User | undefined;
    profile: firebase.firestore.DocumentData | undefined;
}

const ctx = React.createContext<User | null>(null);

export const SessionProvider = ctx.Provider;
export const SessionConsumer = ctx.Consumer;
export const SessionContext = ctx;
