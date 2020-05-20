import Session from './session';
import { SessionContext } from './context';

export type User = {
    user: firebase.User | undefined;
    profile: firebase.firestore.DocumentData | undefined;
};

export default Session;
export { SessionContext };
