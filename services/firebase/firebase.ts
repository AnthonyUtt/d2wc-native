import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, {
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

const defaultPassword = 'd2wc2020';

class Firebase {
    auth: FirebaseAuthTypes.Module;
    db: FirebaseFirestoreTypes.Module;
    constructor() {
        this.auth = auth();
        this.db = firestore();
    }

    getCurrentUser = () => this.auth.currentUser;

    // Authentication API calls
    doCreateUserWithEmailAndPassword = (email: string) =>
        this.auth.createUserWithEmailAndPassword(email, defaultPassword);
    doSignInWithEmailAndPassword = (email: string, password: string) =>
        this.auth.signInWithEmailAndPassword(email, password);
    doSendPasswordResetEmail = (email: string) =>
        this.auth.sendPasswordResetEmail(email);
    doSignOut = () => this.auth.signOut();

    // Firestore API calls
    doAddUserInfo = (uid: string, props: Object) =>
        this.db
            .collection('users')
            .doc(uid)
            .set({ ...props });

    doGetUserInfo = (uid: string) => this.db.collection('users').doc(uid).get();

    doUpdateUserInfo = (uid: string, props: Object) =>
        this.db
            .collection('users')
            .doc(uid)
            .update({ ...props });

    doDeleteUser = (uid: string) =>
        this.db.collection('users').doc(uid).delete();

    doAddUserDetailRecord = (uid: string, details: Object) =>
        this.db
            .collection('users')
            .doc(uid)
            .collection('details')
            .add({ ...details });

    doUpdateUserDetailRecord = (uid: string, did: string, details: Object) =>
        this.db
            .collection('users')
            .doc(uid)
            .collection('details')
            .doc(did)
            .set({ ...details });
    doGetUserDetailRecords = (uid: string) =>
        this.db
            .collection('users')
            .doc(uid)
            .collection('details')
            .orderBy('custom')
            .get();
    doDeleteUserDetailRecord = (uid: string, did: string) =>
        this.db
            .collection('users')
            .doc(uid)
            .collection('details')
            .doc(did)
            .delete();

    doSetPaymentSchedule = (uid: string, schedule: Object) =>
        this.db.collection('users').doc(uid).update({ schedule });
    doSetPaymentStrategy = (uid: string, strategy: Object) =>
        this.db.collection('users').doc(uid).update({ strategy });
}

export default Firebase;
