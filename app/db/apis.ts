
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
import { useStore } from "../store";
import { GridItem } from "../../components/Home/GridList";
export type userDataProps = { 
    firstname: string; 
    lastname: string;  
    phone: string;  
    email: string; 
    isVerified: boolean;
} | null

export type ItemProps = {
    category: string;
    name: string;
    imageUrl: string[];
    pickupAddress: string;
    donor: string;
    status: string;
    reciever: string;
    location: string;
    interestedParties: string[];
}

export type ItemPropsWithID = {
    id: string;
    category: string;
    name: string;
    imageUrl: string[];
    pickupAddress: string;
    donor: string;
    status: string;
    reciever: string;
    location: string;
    interestedParties: string[];
}

const auth: any = getAuth(app);
// 
export const handleSignOut = async (): Promise<number> => {
    let statusCode: number;
    try {
      const logout = await signOut(auth);
      statusCode = 200
      return statusCode
    } catch (err) {
    
      statusCode = 501
      return statusCode
    }
};

export const handleSignUpAuth = async (data: any):Promise<{statusCode: number, userData:userDataProps} | undefined>  => {
    let statusCode: number;
    let userData: userDataProps;
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, data.email, data.password);

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
      return statusCode
    }
};

export const handleSearch = async (queryItem: string): Promise<{statusCode: number, searchResultArray: ItemProps[] | null} | undefined>  => {
    let statusCode: number;
    let searchResultArray:ItemPropsWithID[] = [];
    try {
      const boardDB = collection(db, "Inventory");
      const searchQuery = query(boardDB);
      const querySnapshot: any = await getDocs(searchQuery);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.docs.filter((initDoc: any) => initDoc.data().name.toLocaleLowerCase().includes(queryItem.toLocaleLowerCase())).map((doc: any) =>{
            searchResultArray.push({
                id: doc.id,
                category: doc.data().category,
                name: doc.data().name,
                imageUrl: doc.data().imageUrl,
                pickupAddress: doc.data().pickupAddress,
                donor: doc.data().donor,
                status: doc.data().status,
                reciever: doc.data().reciever,
                location: doc.data().location,
                interestedParties: doc.data().interestedParties,
            });
        })
        
      }
      statusCode = 200;
      return {statusCode, searchResultArray};
    } catch (err) {
      statusCode = 501;
      return {statusCode, searchResultArray};
    }
  };


  
  export const handleDonationList = async (): Promise<{statusCode: number, resultArray: GridItem[] | null} | undefined>  => {
    let statusCode: number;
    let resultArray:ItemPropsWithID[] = [];
    try {
      const boardDB = collection(db, "Inventory");
      const searchQuery = query(boardDB, where("status", "==", 'Available'));
      const querySnapshot: any = await getDocs(searchQuery);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.docs.map((doc: any) =>{
            resultArray.push({
                id: doc.id,
                category: doc.data().category,
                name: doc.data().name,
                imageUrl: doc.data().imageUrl,
                pickupAddress: doc.data().pickupAddress,
                donor: doc.data().donor,
                status: doc.data().status,
                reciever: doc.data().reciever,
                location: doc.data().location,
                interestedParties: doc.data().interestedParties,
            });
        })
        
      }
      statusCode = 200;
      return {statusCode, resultArray};
    } catch (err) {
      statusCode = 501;
      return {statusCode, resultArray};
    }
  };

  export const handleDonate = async (data: any):Promise<{statusCode: number, message: string} | undefined>  => {
    let statusCode: number;
    let itemData: ItemProps | null;
    let message: string;
    const {userData} = useStore()
    try {

        if (userData) {
            let id = `${Crypto.randomUUID()}`;
            const newUser = doc(db, "Inventory", id);
            itemData =  { 
                category: data.category,
                name: data.name,
                imageUrl: data.imageUrl,
                pickupAddress: data.pickupAddress,
                donor: data.donor,
                status: data.status,
                reciever: data.reciever,
                location:data.location,
                interestedParties: data.interestedParties
            }
            await setDoc(
            newUser,
            itemData,
            { merge: true }
            ).then(()=>{
                console.log("new item added")
                
            })
            statusCode = 200;
            message="Sucessful!"
            return {statusCode, message}
        }  
      } catch (error: any) {
       
        statusCode = 501
        message="Oops! Something went wrong."
        return {statusCode, message}
      }
      
};

// export const handleSearch = async ({value}: {value: string}): Promise<number> => {
//     let statusCode: number;
//     try {
//     //   const reset = await sendPasswordResetEmail(auth, email);
//       statusCode = 200

//       return statusCode
//     } catch (error: any) {
//         switch (error.message) {
//             case "Firebase: Error (auth/user-not-found).":
//                 statusCode = 404
//                 break;

//             default:
//                 statusCode = 501
//                 break;
//         }
//       return statusCode
//     }
// };
