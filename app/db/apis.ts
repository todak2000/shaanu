
import {
    collection,
    increment,
    setDoc,
    doc,
    query,
    where,
    getDocs,
    orderBy,
    getDoc,
    or,
    updateDoc,
    arrayRemove,
    arrayUnion,
    serverTimestamp
  } from "@firebase/firestore";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithRedirect,
    sendEmailVerification,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
  } from "firebase/auth";
import { app, db, storage }from './firebase'
import * as Crypto from 'expo-crypto';
import { useStore } from "../store";
import { GridItem } from "../../components/Home/GridList";
import * as FileSystem from 'expo-file-system';

export type userDataProps = {
    id: string; 
    firstname: string; 
    lastname: string;  
    phone: string;  
    email: string; 
    isVerified: boolean;
} | null

export type imageProps = {
  assetId: string;
  uri: string;
  fileName: string;
};
export type ItemProps = {
    category: string;
    name: string;
    imageUrl: imageProps[] | string[];
    pickupAddress: string;
    donor: string;
    status: string;
    reciever: string;
    location: string;
    interestedParties: string[];
}
export type Item2Props = {
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
      console.log(logout, 'logout');
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
        const userCredentials = await createUserWithEmailAndPassword(auth, data.email.toLocaleLowerCase(), data.password);

        if (userCredentials.user) {
            let id = `SHA${Crypto.randomUUID()}`;
            const newUser = doc(db, "Users", id);
            userData =  { 
                id: id,
                firstname: data.firstname, 
                lastname: data.lastname, 
                phone: data.phoneNumber, 
                email: data.email.toLocaleLowerCase(), 
                isVerified: userCredentials.user.emailVerified 
            }
            await setDoc(
            newUser,
            { 
              firstname: data.firstname, 
              lastname: data.lastname, 
              phone: data.phoneNumber, 
              email: data.email.toLocaleLowerCase(), 
              isVerified: userCredentials.user.emailVerified 
          },
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
      const userCredentials = await signInWithEmailAndPassword(auth, data.email.toLocaleLowerCase(), data.password);
      const userDB = collection(db, "Users");
      const userQuery = query(userDB, where("email", "==", userCredentials.user?.email));
      const querySnapshot = await getDocs(userQuery);
      if (querySnapshot.docs.length === 1) {
        statusCode = 200
        userData =  { 
            id:querySnapshot.docs[0].id,
            firstname: querySnapshot.docs[0].data().firstname, 
            lastname: querySnapshot.docs[0].data().lastname, 
            phone: querySnapshot.docs[0].data().phone, 
            email: data.email.toLocaleLowerCase(),
            isVerified: userCredentials.user.emailVerified 
        }
        
        return {statusCode, userData}  
    } 
    

    } catch (error: any) {
      switch (error.message) {
        case "Firebase: Error (auth/user-not-found).":
          return {statusCode:404, userData: null}
        case "Firebase: Error (auth/wrong-password).":
          return {statusCode:401, userData: null}
        default:
          return {statusCode:501, userData: null}
    }
      
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
      // const searchQuery = query(boardDB, where("status", "==", 'Available'));
      const searchQuery = query(boardDB, where("status", "==", 'Available'), orderBy("createdAt", "desc"));
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
    try {
         let id = `${Crypto.randomUUID()}`;
         const res = data.imageUrl.length  > 0 ? await getImageUrl(data.imageUrl, id) : {statusCode:200, urlArr:[]}
         if (res?.statusCode === 200) {
          console.log(res?.urlArr)
          const newUser = doc(db, "Inventory", id);
            await setDoc(
            newUser,
            { 
              category: data.category,
              name: data.name,
              imageUrl: res?.urlArr,
              pickupAddress: data.pickupAddress,
              donor: data.donor,
              status: data.status,
              reciever: '',
              location:data.location,
              interestedParties: [],
              createdAt: serverTimestamp()

          },
            { merge: true }
            ).then(()=>{
                console.log("new item added")
                
            })
            return {statusCode: 200, message: "Item added successfully!"};
         }
         else{
          console.log(res, "erorr")
         }
      } catch (error: any) {
        return {statusCode: 501, message: "Oops! Something went wrong."}
      }
      
};

const uriToBlob = (uri: string) => {
  return new Promise((resolve, reject) => {
     const xhr = new XMLHttpRequest()
     xhr.onload = function () {
       // return the blob
       resolve(xhr.response)
     }
     xhr.onerror = function () {
       reject(new Error('uriToBlob failed'))
     }
     xhr.responseType = 'blob'
     xhr.open('GET', uri, true)
 
     xhr.send(null)
    }
  )
}

const getImageUrl = async (imgArr: imageProps[], id: string): Promise<{ statusCode: number, urlArr: string[] } | undefined> => {
  const urlArr: string[] = [];
  try {
    for (const imgData of imgArr) {
      const fileName = `${imgData.fileName}-${id}`;
      const blob: any = await uriToBlob(imgData.uri)
      const refBucket = `DonationImages/${fileName}`;
      const storageRef = ref(storage, refBucket);
      const snapshot = await uploadBytes(storageRef, blob);
      if (snapshot.metadata.fullPath === refBucket) {
        const url = await getDownloadURL(storageRef);
        urlArr.push(url);
      }
    }
    return { statusCode: 200, urlArr };
  } catch (error: any) {
    let statusCode: number;
    switch (error.code) {
      case 'storage/object-not-found':
        statusCode = 404;
        break;
      default:
        statusCode = 501;
        break;
    }
    return { statusCode, urlArr };
  }
};

export const handleSingleItem = async (id: string): Promise<{statusCode: number, singleItem:GridItem} | any> => {
  let singleItem: GridItem ;
  try {
    const singleItemRef = doc(db, "Inventory", id);
  
    const querySnapshot = await getDoc(singleItemRef);

    if (querySnapshot.exists()) {
      singleItem = {
        id: id,
        category: querySnapshot.data().category,
        name: querySnapshot.data().name,
        imageUrl: querySnapshot.data().imageUrl,
        pickupAddress: querySnapshot.data().pickupAddress,
        donor: querySnapshot.data().donor,
        status: querySnapshot.data().status,
        reciever: querySnapshot.data().reciever,
        location:querySnapshot.data().location,
        interestedParties: querySnapshot.data().interestedParties,
      }
      return {statusCode:200, singleItem} 
    } else {
      console.log('No such document!');
      return {statusCode:200, singleItem:{error:"No such Item exist!"}} 
    }
 
  } catch (error: any) {
    return {statusCode:501, singleItem:{error:"Oops! an error occurred"}}
  }
};


export const handleInterest = async (data: {id: string, userId: string}): Promise<{statusCode: number, message: string} | undefined> => {
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        reciever: data.userId,
        status: "Paired"
      },
      { merge: true }
    )
      return {statusCode:200, message:"Donation item updated successfully"}  
  } catch (error: any) {
    return {statusCode:501, message:"Oops! an error occurred"}
  }
};

export const handlePotentialInterest = async (data: {id: string, userId: string}): Promise<{statusCode: number, message: string} | undefined> => {
  try {
    const interestRef = doc(db, "Inventory", data.id);
    const checkRef = await getDoc(interestRef);
    if (checkRef.data()?.interestedParties.length  < 5) {
      const res = await setDoc(
        interestRef,
        {
          interestedParties: arrayUnion(data.userId)
        },
        { merge: true }
      )
      return {statusCode:200, message:"Congrats! your interest is well noted."} 
    }
    else{
      return {statusCode:403, message:"We regret to inform you that the interest quota has been exceeded. We apologize for any inconvenience this may have caused. Thank you for your understanding."} 
    }
    
       
  } catch (error: any) {
    return {statusCode:501, message:"Oops! an error occurred"}
  }
};

export const handleRemoveInterest = async (data: {id: string, userId: string}): Promise<{statusCode: number, message: string} | undefined> => {
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        interestedParties: arrayRemove(data.userId)
      },
      { merge: true }
    )
      return {statusCode:200, message:"Your withdrawal request has been approved!"}  
  } catch (error: any) {
    return {statusCode:501, message:"Oops! an error occurred"}
  }
};

export const handleCatalogList = async (userId: string): Promise<{statusCode: number, catalogList: GridItem[]} | undefined> => {
  let catalogList: GridItem[] = [];
  try {
    const catalogRef = collection(db, "Inventory");
    // const catalogQuery = query(catalogRef, where("donor", "==", userId))
    // const catalogQuery = query(catalogRef, where("interestedParties", 'array-contains-any', [userId]))
    const catalogQuery = query(
      catalogRef, 
      or(
        where("donor", "==", userId),
        where("interestedParties", 'array-contains-any', [userId])
      ));
    const querySnapshot: any = await getDocs(catalogQuery);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.docs.map((doc: any) =>{
          catalogList.push({
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
      return {statusCode:200, catalogList}  
  } catch (error: any) {
    console.log(error, 'error')
    return {statusCode:501, catalogList}
  }
};

// export const handleCatalogList = async (userId: string): Promise<{statusCode: number, catalogList: GridItem[]} | undefined> => {
//   let catalogList: GridItem[];
//   try {
//     const catalogRef = collection(db, "Inventory");
//     const catalogQuery = query(
//       catalogRef, 
//       or(
//         where("donor", "==", userId),
//         where("interestedParties", 'array-contains-any', userId)
//       ));
//     const querySnapshot: any = await getDocs(catalogQuery);
//       if (querySnapshot.docs.length > 0) {
//         querySnapshot.docs.map((doc: any) =>{
//           catalogList.push({
//                 id: doc.id,
//                 category: doc.data().category,
//                 name: doc.data().name,
//                 imageUrl: doc.data().imageUrl,
//                 pickupAddress: doc.data().pickupAddress,
//                 donor: doc.data().donor,
//                 status: doc.data().status,
//                 reciever: doc.data().reciever,
//                 location: doc.data().location,
//                 interestedParties: doc.data().interestedParties,
//             });
//         })
        
//       }
//       return {statusCode:200, catalogList}  
//   } catch (error: any) {
//     return {statusCode:501, catalogList}
//   }
// };