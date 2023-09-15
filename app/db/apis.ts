import {
  collection,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  getDoc,
  increment,
  deleteDoc,
  or,
  onSnapshot,
  arrayRemove,
  arrayUnion,
  serverTimestamp,
  DocumentData,
  limit,
  startAfter,
} from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ITEM_DELIVERY_SUCCESS, CLEAR_SINGLE_ITEM, GET_SINGLE_ITEM_SUCCESS, GET_SINGLE_ITEM_FAILURE, CATALOG_SUCCESS, CATALOG_FAILURE, INVENTORY_RECIVER_REMOVE, INVENTORY_RECIVER_ADD, INVENTORY_UPDATE_ADD, INVENTORY_UPDATE_REMOVE, UPDATE_NOTIFICATION_LOADING, UPDATE_NOTIFICATION_SUCCESS, UPDATE_NOTIFICATION_FAILURE, USERDATA_FAILURE, USERDATA_LOADING, USERDATA_SUCCESS, SIGNUP_LOADING, SIGNUP_FAILURE, SIGNUP_SUCCESS, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_LOADING, LOGIN_FAILURE, LOGIN_LOADING, LOGIN_SUCCESS, LOGOUT_SUCCESS, INVENTORY_LOADING, INVENTORY_SUCCESS, INVENTORY_FAILURE} from "../store/constants";
import { removeLocalItem, saveLocalItem } from "../utils/localStorage";
import { type Dispatch } from 'react'
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  deleteUser,
} from "firebase/auth";
import { app, db, storage } from "./firebase";
import * as Crypto from "expo-crypto";
import { GridItem } from "../../components/Home/GridList";
import { dateFormaterString } from "../utils";

export type userDataProps = {
  id: string;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  isVerified: boolean;
  donated: number;
  isActive: boolean;
  recieved: number;
  expoPushToken: string;
} | null;

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
};
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
};

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
};

export type chatProps = {
  chatId: string;
  donorId: string;
  recipientId: string;
  itemName: string;
  chatCorrespondence: chatCorrespondenceProps[];
};

type chatCorrespondenceProps = {
  userId: string;
};

export const auth: any = getAuth(app);

// Delete User Account
export const handleDeleteAccount =(userId: string)=> async(dispatch: Dispatch<any>): Promise<number> => {
  let statusCode: number;
  dispatch({ type: LOGIN_LOADING, loading: true })
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    const deleteRef = doc(db, "Users", userId);
    await setDoc(deleteRef, { isActive: false }, { merge: true });
    await deleteUser(user);
    dispatch({ type: LOGOUT_SUCCESS, loading: false })
    await removeLocalItem().then(()=>console.log('local storage cleared'))
    statusCode = 200;
  } catch (err: any) {
    dispatch({ type: LOGIN_LOADING, loading: false })
    if (err.message === "Firebase: Error (auth/requires-recent-login).") {
      statusCode = 501;
    } else {
      statusCode = 509;
    }
  }
  dispatch({ type: LOGIN_LOADING, loading: false })
  return statusCode;
};

// User Signout
export const handleSignOut = ()=> async(dispatch: Dispatch<any>): Promise<number> => {
  let statusCode: number;
  try {
    dispatch({ type: LOGIN_LOADING, loading: true })
    const logout = await signOut(auth);
    dispatch({ type: LOGOUT_SUCCESS, loading: false })
    console.log(logout, "logout");
    statusCode = 200;
    return statusCode;
  } catch (error: any) {
    statusCode = 501;
    return statusCode;
  }
};

 // User Signup
 export const handleSignUpAuth = (
  data: any
  ) => async (dispatch: Dispatch<any>) => {
// ) => async (dispatch: Dispatch<any>): Promise<{ statusCode: number; userData: userDataProps } | undefined> => {
  let timeoutId;
  let token, res;

  // Start a 10-second timer
const timer = new Promise((resolve, reject) => {
  timeoutId = setTimeout(() => {
    reject(new Error("Process timed out"));
  }, 10000);
});

// Start the process
const process = (async () => {
  try {
    dispatch({ type: SIGNUP_LOADING, loading: true })
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      data.email.toLocaleLowerCase(),
      data.password
    );
      let id = `SHA${Crypto.randomUUID()}`;
      const newUser = doc(db, "Users", id);
      const userData: userDataProps = {
        id: id,
        firstname: data.firstname,
        lastname: data.lastname,
        phone: data.phoneNumber,
        email: data.email.toLocaleLowerCase(),
        isVerified: userCredentials.user.emailVerified,
        isActive: true,
        donated: 0,
        recieved: 0,
        expoPushToken: data.expoPushToken,
      };
      await setDoc(
        newUser,
        {
          firstname: data.firstname,
          lastname: data.lastname,
          phone: data.phoneNumber,
          email: data.email.toLocaleLowerCase(),
          isVerified: userCredentials.user.emailVerified,
          isActive: true,
          donated: increment(0),
          recieved: increment(0),
          expoPushToken: data.expoPushToken,
        },
        { merge: true }
      )
        dispatch({ type: SIGNUP_LOADING, loading: false })

      await sendEmailVerification(auth.currentUser);
      dispatch({
        type: SIGNUP_SUCCESS,
        payload: {
          userData: userData,
          isRegistered: false
        }
      })
      return { statusCode: 200, userData };
    // }
  } catch (error: any) {
    let statusCode;
    switch (error.message) {
      case "Firebase: Error (auth/email-already-exists).":
      case "Firebase: Error (auth/email-already-in-use).":
        const checkDB = collection(db, "Users");
        const checkQuery = query(
          checkDB,
          where("email", "==", data.email.toLocaleLowerCase())
        );
        const querySnapshot: any = await getDocs(checkQuery);
        if (querySnapshot.docs.length <= 0 ) {
          
          let id = `SHA${Crypto.randomUUID()}`;
          const newUser = doc(db, "Users", id);
          await setDoc(
            newUser,
            {
              firstname: data.firstname,
              lastname: data.lastname,
              phone: data.phoneNumber,
              email: data.email.toLocaleLowerCase(),
              isVerified: false,
              isActive: true,
              donated: increment(0),
              recieved: increment(0),
              expoPushToken: data.expoPushToken,
            },
            { merge: true }
          )
          statusCode = 200;
          console.log('no exist dta')
        }
        else {
          console.log('exist dta')
          statusCode = 409;
        }
        
        break;
      default:
        statusCode = 501;
        break;
    }
    dispatch({ type: SIGNUP_LOADING, loading: false })
    dispatch({ type: SIGNUP_FAILURE, error: error?.message })
    return { statusCode, userData: null };
  }
})();
// Wait for either the process to complete or the timer to expire
try {
  const result = await Promise.race([timer, process]);
  clearTimeout(timeoutId);
  return result;
} catch (error: any) {
  // Reverse the process here if needed
  // ...
  console.error(error.message, 'error');
  throw error;
}

  
};

export  const getUserData = (id: string) => async(dispatch: Dispatch<any>)=> {
    
  try {
    dispatch({ type: USERDATA_LOADING, loading: true })
    if (auth.currentUser && id) {
      dispatch({ type: USERDATA_LOADING, loading: false })
      const userDataRef = doc(db, "Users", id);
      onSnapshot(userDataRef, (querySnapshot) => {
        if (querySnapshot) {
          const updatedUser: any = { id: id, ...querySnapshot.data() }
          dispatch({
            type: USERDATA_SUCCESS,
            payload: {
              userData: updatedUser,
            }
          })
          const user = JSON.stringify(updatedUser)
          saveLocalItem('userData', user).then(() => {})
          console.log('------successfully pull user data and upafe it --')
        }
      });
    }
  } catch (error: any) {
    dispatch({ type: USERDATA_LOADING, loading: false })
    dispatch({ type: USERDATA_FAILURE, error: error?.message })
    console.log(error, 'get data error')
  }
}
// User Sign in
export const handleSignInAuth = (
  data: any
) => async (dispatch: Dispatch<any>): Promise<{ statusCode: number; userData: userDataProps } | undefined> => {
  let statusCode: number;
  let userData: userDataProps;
  try {
    dispatch({ type: LOGIN_LOADING, loading: true })
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      data.email.toLocaleLowerCase(),
      data.password
    );
    const userDB = collection(db, "Users");
    const userQuery = query(
      userDB,
      where("email", "==", userCredentials.user?.email)
    );
    
    const querySnapshot = await getDocs(userQuery);
    
    if (querySnapshot.docs.length === 1) {
      dispatch({ type: LOGIN_LOADING, loading: false })
      statusCode = 200;
      userData = {
        id: querySnapshot.docs[0].id,
        firstname: querySnapshot.docs[0].data().firstname,
        lastname: querySnapshot.docs[0].data().lastname,
        phone: querySnapshot.docs[0].data().phone,
        email: data.email.toLocaleLowerCase(),
        isVerified: userCredentials.user.emailVerified,
        isActive: querySnapshot.docs[0].data().isActive,
        donated: querySnapshot.docs[0].data().donated,
        recieved: querySnapshot.docs[0].data().recieved,
        expoPushToken: querySnapshot?.docs[0]?.data()?.expoPushToken || "",
      };
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          userData: userData,
          isRegistered: true
        }
      })
      const user = JSON.stringify(userData)
      await saveLocalItem('userData', user)
      return { statusCode, userData };
    }
  } catch (error: any) {
    dispatch({ type: LOGIN_LOADING, loading: false })
    dispatch({ type: LOGIN_FAILURE, error: error?.message })
    switch (error.message) {
      case "Firebase: Error (auth/user-not-found).":
        return { statusCode: 404, userData: null };
      case "Firebase: Error (auth/wrong-password).":
        return { statusCode: 401, userData: null };
      default:
        return { statusCode: 501, userData: null };
    }
  }
};

// User reset Password
export const handlePasswordReset = ({
  email,
}: {
  email: string;
}) => async (dispatch: Dispatch<any>): Promise<number> => {
  let statusCode: number;
  try {
    dispatch({ type: CHANGE_PASSWORD_LOADING, loading: true })
    const reset = await sendPasswordResetEmail(auth, email);
    statusCode = 200;
    dispatch({ type: CHANGE_PASSWORD_LOADING, loading: false })
    return statusCode;
  } catch (error: any) {
    switch (error.message) {
      case "Firebase: Error (auth/user-not-found).":
        statusCode = 404;
        break;

      default:
        statusCode = 501;
        break;
    }
    dispatch({ type: CHANGE_PASSWORD_LOADING, loading: false })
    dispatch({ type: CHANGE_PASSWORD_FAILURE, error: error?.message })
    return statusCode;
  }
};

// User search items in Dashboard (Protected route)
export const handleSearch = (queryItem: string)=> async (dispatch: Dispatch<any>): Promise<
  { statusCode: number; searchResultArray: ItemProps[] | null } | undefined
> => {
  dispatch({ type: INVENTORY_LOADING, loading: true })
  let statusCode: number;
  let searchResultArray: ItemPropsWithID[] = [];
  try {
    const boardDB = collection(db, "Inventory");
    const searchQuery = query(boardDB);
    const querySnapshot: any = await getDocs(searchQuery);
    dispatch({ type: INVENTORY_LOADING, loading: false })
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs
        .filter((initDoc: any) =>
          initDoc
            .data()
            .name.toLocaleLowerCase()
            .includes(queryItem.toLocaleLowerCase())
        )
        .map((doc: any) => {
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
        });
      dispatch({
        type: INVENTORY_SUCCESS,
        payload: {
          inventory: searchResultArray
        }
      })
    }
    statusCode = 200;
    return { statusCode, searchResultArray };
  } catch (error: any) {
    statusCode = 501;
    dispatch({ type: INVENTORY_LOADING, loading: false })
    dispatch({ type: INVENTORY_FAILURE, error: error?.message })
    return { statusCode, searchResultArray };
  }
};

// Donation List (Protected route)
export const handleDonationList = async (): Promise<
  { statusCode: number; resultArray: GridItem[] | null } | undefined
> => {
  let statusCode: number;
  let resultArray: ItemPropsWithID[] = [];
  try {
    const boardDB = collection(db, "Inventory");
    const searchQuery = query(
      boardDB,
      where("status", "==", "Available"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot: any = await getDocs(searchQuery);
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.map((doc: any) => {
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
      });
    }
    statusCode = 200;
    return { statusCode, resultArray };
  } catch (err) {
    statusCode = 501;
    return { statusCode, resultArray };
  }
};

// User Donate Item (Protected route)
export const handleDonate = async (
  data: any
): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    let id = `${Crypto.randomUUID()}`;
    const res =
      data.imageUrl.length > 0
        ? await getImageUrl(data.imageUrl, id)
        : { statusCode: 200, urlArr: [] };
    if (res?.statusCode === 200) {
      console.log(res?.urlArr);
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
          reciever: "",
          location: data.location,
          interestedParties: [],
          createdAt: serverTimestamp(),
        },
        { merge: true }
      ).then(() => {
        console.log("new item added");
      });
      return { statusCode: 200, message: "The item has been successfully added." };
    } else {
      console.log(res, "erorr");
    }
  } catch (error: any) {
    return { statusCode: 501, message: "Oops! Something went wrong." };
  }
};

// Uri to Blob Converter Function
const uriToBlob = (uri: string) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };
    xhr.onerror = function () {
      reject(new Error("uriToBlob failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);

    xhr.send(null);
  });
};

// Image getter function from Firebase storage
const getImageUrl = async (
  imgArr: imageProps[],
  id: string
): Promise<{ statusCode: number; urlArr: string[] } | undefined> => {
  const urlArr: string[] = [];
  try {
    for (const imgData of imgArr) {
      const fileName = `${imgData.fileName}-${id}`;
      const blob: any = await uriToBlob(imgData.uri);
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
      case "storage/object-not-found":
        statusCode = 404;
        break;
      default:
        statusCode = 501;
        break;
    }
    return { statusCode, urlArr };
  }
};

// Get single Donated Item Details (Protected route)
export const handleSingleItem = (
  id: string
) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; singleItem: GridItem } | any> => {
  let singleItem: GridItem;
  try {
    dispatch({ type: CLEAR_SINGLE_ITEM, loading: true })
    
    const singleItemRef = doc(db, "Inventory", id);

    const querySnapshot = await getDoc(singleItemRef);
    dispatch({ type: INVENTORY_LOADING, loading: false })
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
        location: querySnapshot.data().location,
        interestedParties: querySnapshot.data().interestedParties,
      };
      dispatch({
        type: GET_SINGLE_ITEM_SUCCESS,
        payload: singleItem
      })
      return { statusCode: 200, singleItem };
    } else {
      console.log("No such document!");
      return { statusCode: 200, singleItem: { error: "No such Item exist!" } };
    }
  } catch (error: any) {
    dispatch({ type: GET_SINGLE_ITEM_FAILURE, error: error?.message })
    return {
      statusCode: 501,
      singleItem: { error: "Oops! an error occurred" },
    };
  }
};

// Donor remove reciepient (Protected route)
export const handleRemoveReciever = async (data: {
  id: string;
  recipientId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        reciever: "",
        status: "Available",
        interestedParties: arrayRemove(data.recipientId),
      },
      { merge: true }
    );
    handleDestroyChat(data.id).then(() => console.log("recipeint removed"));

    return { statusCode: 200, message: "The recipient has been successfully removed." };
  } catch (error: any) {
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Donor picked a recipent of his/her donated Item  and intiate chat (Protected route)
export const handleInterest = (data: {
  id: string;
  userId: string;
  giverId: string;
  itemId: string;
  itemName: string;
  pickupAddress: string;
  recipientId: string;
})=> async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string } | undefined> => {
  const chatData = {
    giverId: data.giverId,
    itemId: data.itemId,
    itemName: data.itemName,
    pickupAddress: data.pickupAddress,
    recipientId: data.recipientId,
  };
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        reciever: data.userId,
        status: "Paired",
      },
      { merge: true }
    ).then(() => {
      handleInitiateChat(chatData).then(
        (res) => res?.statusCode === 200 && console.log("chat initialted")
      );
    });
    dispatch({
      type: INVENTORY_RECIVER_ADD,
      payload: {
        id: data.id,
        reciever: data.userId
      }
    })
    return { statusCode: 200, message: "The donation item has been successfully updated." };
  } catch (error: any) {
    dispatch({
      type: INVENTORY_RECIVER_REMOVE,
      payload: data.id
    })
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Recipient shows interest in a Donated item (Protected route)
export const handlePotentialInterest = (data: {
  id: string;
  userId: string;
}) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const interestRef = doc(db, "Inventory", data.id);
    console.log(data.userId, "error handle interest")
    const checkRef = await getDoc(interestRef);
    dispatch({ type: INVENTORY_LOADING, loading: false })
    if (checkRef.data()?.interestedParties.length < 5) {
      const res = await setDoc(
        interestRef,
        {
          interestedParties: arrayUnion(data.userId),
        },
        { merge: true }
      );
      dispatch({
        type: INVENTORY_UPDATE_ADD,
        payload: {
          id: data.id,
          newParty: data.userId
        }
      })
      return {
        statusCode: 200,
        message: "Congratulations! We have duly noted your interest.",
      };
    } else {
      return {
        statusCode: 403,
        message:
          "We regret to inform you that the interest quota has been exceeded. We apologize for any inconvenience this may have caused. Thank you for your understanding.",
      };
    }
  } catch (error: any) {
    
    dispatch({ type: INVENTORY_FAILURE, loading: false })
    dispatch({ type: INVENTORY_FAILURE, error: error?.message })
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Recipient removes interest from an donated item (Protected route)
export const handleRemoveInterest = (data: {
  id: string;
  userId: string;
}) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        interestedParties: arrayRemove(data.userId),
      },
      { merge: true }
    );
    dispatch({ type: INVENTORY_LOADING, loading: false })
    dispatch({
      type: INVENTORY_UPDATE_REMOVE,
      payload: {
        id: data.id,
        removeParty: data.userId
      }
    })
    return {
      statusCode: 200,
      message: "Your request for withdrawal has been approved. Please let us know if you need further assistance.",
    };
  } catch (error: any) {
    dispatch({ type: INVENTORY_FAILURE, loading: false })
    dispatch({ type: INVENTORY_FAILURE, error: error?.message })
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// User Catalog List show both donated and recieved items (Protected route)
export const handleCatalogList = (
  userId: string
) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; catalogList: any } | undefined> => {
  let catalogList: any = {};
  let donorList: GridItem[] = [];
  let recieverList: GridItem[] = [];

  try {
    dispatch({ type: INVENTORY_LOADING, loading: true })
    const catalogRef = collection(db, "Inventory");
    const catalogQuery = query(
      catalogRef,
      or(
        where("donor", "==", userId),
        where("interestedParties", "array-contains-any", [userId])
      )
    );
    // console.log(userId, 'dockcck')
    const querySnapshot: any = await getDocs(catalogQuery);
    dispatch({ type: INVENTORY_LOADING, loading: false })
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.filter((doc: any) => doc.data()?.interestedParties?.includes(userId)).map((doc: any) =>{
        recieverList.push({
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
      querySnapshot.docs.filter((doc: any) => doc.data()?.donor === userId).map((doc: any) =>{
        donorList.push({
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
    dispatch({
      type: CATALOG_SUCCESS,
      payload: {
        donorList: donorList,
        recieverList: recieverList
      }
    })
    return { statusCode: 200, catalogList: {donorList: donorList, recieverList: recieverList} };
  } catch (error: any) {
    console.log(error, "error");
    dispatch({ type: INVENTORY_FAILURE, loading: false })
    dispatch({ type: CATALOG_FAILURE, error: error?.message })
    return { statusCode: 501, catalogList };
  }
};

// Delete Chat after transaction is complete
const handleDestroyChat = async (
  chatId: string
): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const chatRef = doc(db, "Chat", chatId);
    const deleteRef: any = await getDoc(chatRef);
    if (deleteRef.exists()) {
      await deleteDoc(deleteRef).then(() => {
        return {
          statusCode: 200,
          message: "Success!",
        };
      });
    }
  } catch (error: any) {
    return { statusCode: 501, message: "Opps! an error occured" };
  }
};

// Initiate Chat between DOnor and Recipeient
const handleInitiateChat = async (data: {
  giverId: string;
  itemId: string;
  itemName: string;
  pickupAddress: string;
  recipientId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  const adminMessage = ` Welcome to the Shaanu chat for ${data.itemName}! You are connected as a donor and recipient. The chat will be open for 7 days and the item should be picked up at ${data.pickupAddress}. After 7 days, the chat will close. Keep the conversation professional. Have a great chat! 😊`;
  const adminMessageLong = `Hello, and welcome to the Shaanu chat for ${data.itemName}! You have been connected because one of you is the donor of an item, and the other is the recipient. This chat will be open for 7 days, during which the donated item is expected to have been delivered at the agreed pickup point. After this period, the chat will no longer be accessible by either of you. Please keep your conversation strictly professional and refrain from sharing unnecessary messages between yourselves. Thank you and have a great chat! 😊`;
  try {
    const chatRef = doc(db, "Chat", data.itemId);
    const checkRef = await getDoc(chatRef);
    if (checkRef.exists()) {
      // await handleGetAllChat(data.itemId)
    } else {
      await setDoc(
        chatRef,
        {
          donorId: data?.giverId,
          itemName: data?.itemName,
          recipientId: data?.recipientId,
          chatCorrespondence: [
            {
              admin: adminMessage,
              timestamp: dateFormaterString(new Date().toString()),
            },
          ],
        },
        { merge: true }
      );
    }
    return {
      statusCode: 200,
      message: "Success!",
    };
  } catch (error: any) {
    return { statusCode: 501, message: "Opps! an error occured" };
  }
};

// Get all chat between a Donor and Recipent
export const handleGetAllChat = async (
  chatId: string
): Promise<{ statusCode: number; chatData: chatProps | null } | undefined> => {
  let chatData: chatProps;
  if  (auth.currentUser){
    try {
      const chatt = doc(db, "Chat", chatId);
      onSnapshot(chatt, (querySnapshot) => {
        if (querySnapshot) {
          chatData = {
            chatId: chatId,
            donorId: querySnapshot.data()?.donorId,
            itemName: querySnapshot.data()?.itemName,
            recipientId: querySnapshot.data()?.recipientId,
            chatCorrespondence: querySnapshot.data()?.chatCorrespondence,
          };
        }
        return { statusCode: 200, chatData };
      });
    } catch (error: any) {
      console.log(error, "errrrr");
      return { statusCode: 501, chatData: null };
    }
  }
};

// Update Chat
export const handleUpdateChat = async (data: {
  chatId: string;
  messengerId: string;
  message: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const chatRef = doc(db, "Chat", data.chatId);
    await setDoc(
      chatRef,
      {
        chatCorrespondence: arrayUnion({
          [data.messengerId]: data.message,
          timestamp: dateFormaterString(new Date().toString()),
        }),
      },
      { merge: true }
    );

    return { statusCode: 200, message: "Chat updated successfully!" };
  } catch (error) {
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Recipeint Confirm Delivery of Item
export const handleConfirmDelivery = (data: {
  itemId: string;
  donorId: string;
  recieverId: string;
}) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    dispatch({ type: INVENTORY_LOADING, loading: true })
    const boardRef = doc(db, "Inventory", data.itemId);
    const res = await setDoc(
      boardRef,
      {
        status: "Delivered",
        deliveryDate: dateFormaterString(new Date().toString()),
      },
      { merge: true }
    );
    const donorRef = doc(db, "Users", data.donorId);
    const donor = await setDoc(
      donorRef,
      {
        donated: increment(1),
      },
      { merge: true }
    );
    const recRef = doc(db, "Users", data.recieverId);
    const rec = await setDoc(
      recRef,
      {
        recieved: increment(1),
      },
      { merge: true }
    );
    
    dispatch({
      type: ITEM_DELIVERY_SUCCESS,
      payload: {
        id: data.itemId,
        status: "Delivered"
      }
    })
    return {
      statusCode: 200,
      message: "The donation item has been successfully updated.",
    };
  } catch (error: any) {
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Get user Expo Token (Protected route)
export const getExpoToken = async (
  userId: string
): Promise<{ statusCode: number; token: string } | any> => {
  let token: string = "";
  try {
    const singleItemRef = doc(db, "Users", userId);

    const querySnapshot = await getDoc(singleItemRef);

    if (querySnapshot.exists()) {
      token = querySnapshot.data().expoPushToken;
      return { statusCode: 200, token: token };
    } else {
      console.log("No such document!");
      return { statusCode: 300, token: token };
    }
  } catch (error: any) {
    return {
      statusCode: 501,
      token: token,
    };
  }
};



// Update User - add expo Token 
export const handleAddExpoToken = (
  data: {userId: string, token: string}
) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string, token?: string } | undefined> => {
  dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
  try {
    const updateRef = doc(db, "Users", data.userId);

      await setDoc(
        updateRef,
        {
          expoPushToken: data.token,
        },
        { merge: true }
      );
      dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
      dispatch({
        type: UPDATE_NOTIFICATION_SUCCESS,
        payload: data.token
      })
      return { statusCode: 200, message: "Expo token successfully added!", token: data.token };
    
  } catch (error: any) {
    console.log(error, "active");
    dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
    dispatch({ type: UPDATE_NOTIFICATION_FAILURE, error: error?.message })
    return { statusCode: 500, message:"Oops! an error occured" };
  }
};

// Update User - remove expo Token 
export const handleRemoveExpoToken = (userId: string) => async(dispatch: Dispatch<any>): Promise<{ statusCode: number; message: string, token?: string } | undefined> => {
  dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
  try {
    const updateRef = doc(db, "Users", userId);

      await setDoc(
        updateRef,
        {
          expoPushToken: "",
        },
        { merge: true }
      );
      dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
      dispatch({
        type: UPDATE_NOTIFICATION_SUCCESS,
        payload: ""
      })
      return { statusCode: 200, message: "Expo token successfully removed!", token: "" };
    
  } catch (error: any) {
    dispatch({ type: UPDATE_NOTIFICATION_LOADING, loading: false })
    dispatch({ type: UPDATE_NOTIFICATION_FAILURE, error: error?.message })
    return { statusCode: 500, message:"Oops! an error occured" };
  }
};


type fetchInventoryProps = {
  afterDoc?: DocumentData | null,
  oldData?: any,
  category?: string
}

export const fetchInventoryData = (data: fetchInventoryProps)=> async (dispatch: Dispatch<any>) => {
  try {
    dispatch({ type: INVENTORY_LOADING, loading: true })
    let searchQuery;
    const boardDB = collection(db, "Inventory");
    if (data.afterDoc) {
      const initQuery = query(
        boardDB,
        where("status", "==", "Available"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
      searchQuery = query(initQuery, startAfter(data.afterDoc));
    } else {
      searchQuery = query(
        boardDB,
        where("status", "==", "Available"),
        orderBy("createdAt", "desc"),
        limit(20)
      );
    }
  
    const snapshot = await getDocs(searchQuery);
    dispatch({ type: INVENTORY_LOADING, loading: false })
    
    if (!snapshot.empty && (data.category === '' || typeof data.category === 'object' )) {
      const uniqueIds = new Set(data?.oldData?.map((item: any) => item.id))
      const newData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as GridItem))
          .filter((item) => !uniqueIds.has(item.id))
          .filter((newItem) => newItem.interestedParties.length < 5);

      dispatch({
        type: INVENTORY_SUCCESS,
        payload: {
          inventory: newData,
          oldInventory: snapshot.docs[snapshot.docs.length - 1]
        }
      })
    }
    //category filter
    else if (!snapshot.empty  && data.category !== '') {
      const newData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as GridItem))
          .filter((item) => item?.category === data?.category)
          .filter((newItem) => newItem.interestedParties.length < 5);
      dispatch({
        type: INVENTORY_SUCCESS,
        payload: {
          inventory: newData
        }
      })
    }

  } catch (error: any) {
    console.error(error);
    dispatch({ type: INVENTORY_LOADING, loading: false })
    dispatch({ type: INVENTORY_FAILURE, error: error?.message })
  }
  // setLoading(false);
};