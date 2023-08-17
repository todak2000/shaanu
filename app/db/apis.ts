
import {
    collection,
    increment,
    setDoc,
    doc,
    query,
    where,
    getDocs,
    getDoc,
  } from "@firebase/firestore";
  import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail
  } from "firebase/auth";
import { app, db }from './firebase'
import * as Crypto from 'expo-crypto';

export type userDataProps = { 
    firstname: string; 
    lastname: string;  
    phone: string;  
    email: string; 
    isVerified: boolean;
} | null

const auth: any = getAuth(app);
// 
export const handleSignOut = async (): Promise<number> => {
    let statusCode: number;
    try {
      const logout = await signOut(auth);
      statusCode = 200
    //   console.log(statusCode, 'logout statusCode');
      return statusCode
    } catch (err) {
    
      statusCode = 501
    //   console.log(statusCode, 'logout statusCode');
    //   console.log(err, 'logout err');
      return statusCode
    }
};

export const handleSignUpAuth = async (data: any):Promise<{statusCode: number, userData:userDataProps} | undefined>  => {
    let statusCode: number;
    let userData: userDataProps;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
        // console.log(userCredentials, 'cred')

        if (userCredentials.user) {
            let id = `SHA${Crypto.randomUUID()}`;
            const newUser = doc(db, "Users", id);
            userData =  { 
                firstname: data.firstname, 
                lastname: data.lastname, 
                phone: data.phoneNumber, 
                email: data.email, 
                isVerified: userCredentials.user.emailVerified 
            }
            await setDoc(
            newUser,
            userData,
            { merge: true }
            ).then(()=>{
                sendEmailVerification(auth.currentUser)
                
            })
            statusCode = 200
            return {statusCode, userData}
        }  
      } catch (error: any) {
        // console.log(error.message);
        switch (error.message) {
            case "Firebase: Error (auth/email-already-exists).":
                statusCode = 409
                break;
        
            default:
                statusCode = 501
                break;
        }
        
        userData = null
        return {statusCode, userData}
      }
      
};

export const handleSignInAuth = async (data: any): Promise<{statusCode: number, userData:userDataProps} | undefined> => {
    let statusCode: number;
    let userData: userDataProps;
    try {
      const userCredentials = await signInWithEmailAndPassword(auth, data.email, data.password);

    //   console.log(userCredentials.user.emailVerified, 'cred verified')
      const userDB = collection(db, "Users");
      const userQuery = query(userDB, where("email", "==", userCredentials.user?.email));
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.docs.length > 0) {
        statusCode = 200
        userData =  { 
            firstname: querySnapshot.docs[0].data().firstname, 
            lastname: querySnapshot.docs[0].data().lastname, 
            phone: querySnapshot.docs[0].data().phone, 
            email: data.email,
            isVerified: userCredentials.user.emailVerified 
        }
        return {statusCode, userData}
        
    } 

    } catch (error: any) {
    //   console.log(error?.message);
      switch (error.message) {
        case "Firebase: Error (auth/user-not-found).":
            statusCode = 404
            break;
        case "Firebase: Error (auth/wrong-password).":
            statusCode = 401
            break;
        default:
            statusCode = 501
            break;
    }
      userData = null
      return {statusCode, userData}
    }
};

export const handlePasswordReset = async ({email}: {email: string}): Promise<number> => {
    let statusCode: number;
    try {
      const reset = await sendPasswordResetEmail(auth, email);
      statusCode = 200
    //   console.log(statusCode, 'reset statusCode');
      return statusCode
    } catch (error: any) {
        switch (error.message) {
            case "Firebase: Error (auth/user-not-found).":
                statusCode = 404
                break;

            default:
                statusCode = 501
                break;
        }
    //   console.log(statusCode, 'reset statusCode');
    //   console.log(error, 'reset err');
      return statusCode
    }
};


const provider = new GoogleAuthProvider();
// Google Auth
export const handleGoogleAuth = async (): Promise<{user: any} | undefined> => {
  try {
    const userCredentials = await signInWithRedirect(auth, provider); //signInWithPopup(auth, provider);
    // const credential: any =
    //   GoogleAuthProvider.credentialFromResult(userCredentials);
    console.log(userCredentials, 'cred')
    // const user: any = userCredentials.user;
    // if (user) {
      
    //   console.log(user, "sdsds");
    //   return user;
    // }
    return ;
  } catch (err) {
    console.log(err);
  }
};