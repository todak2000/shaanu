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
} from "@firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
export const handleDeleteAccount = async (userId: string): Promise<number> => {
  let statusCode: number;

  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("No user is currently signed in");
    }
    const deleteRef = doc(db, "Users", userId);
    await setDoc(deleteRef, { isActive: false }, { merge: true });
    await deleteUser(user);
    statusCode = 200;
  } catch (err: any) {
    console.log(err.message, "err.message");
    if (err.message === "Firebase: Error (auth/requires-recent-login).") {
      statusCode = 501;
    } else {
      statusCode = 509;
    }
  }
  return statusCode;
};

// User Signout
export const handleSignOut = async (): Promise<number> => {
  let statusCode: number;
  try {
    const logout = await signOut(auth);
    console.log(logout, "logout");
    statusCode = 200;
    return statusCode;
  } catch (err) {
    statusCode = 501;
    return statusCode;
  }
};

 // User Signup
export const handleSignUpAuth = async (
  data: any
): Promise<{ statusCode: number; userData: userDataProps } | undefined> => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      data.email.toLocaleLowerCase(),
      data.password
    );

    if (userCredentials.user) {
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
      // .then(() => {
        
      // }).catch(async()=> await deleteUser(auth.currentUser));
      await sendEmailVerification(auth.currentUser);
      return { statusCode: 200, userData };
    }
  } catch (error: any) {
    let statusCode;
    switch (error.message) {
      case "Firebase: Error (auth/email-already-exists).":
        statusCode = 409;
        break;
      case "Firebase: Error (auth/email-already-in-use).":
        statusCode = 409;
        break;
      default:
        statusCode = 501;
        break;
    }

    return { statusCode, userData: null };
  }
};

// User Sign in
export const handleSignInAuth = async (
  data: any
): Promise<{ statusCode: number; userData: userDataProps } | undefined> => {
  let statusCode: number;
  let userData: userDataProps;
  try {
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

      return { statusCode, userData };
    }
  } catch (error: any) {
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
export const handlePasswordReset = async ({
  email,
}: {
  email: string;
}): Promise<number> => {
  let statusCode: number;
  try {
    const reset = await sendPasswordResetEmail(auth, email);
    statusCode = 200;
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
    return statusCode;
  }
};

// User search items in Dashboard (Protected route)
export const handleSearch = async (
  queryItem: string
): Promise<
  { statusCode: number; searchResultArray: ItemProps[] | null } | undefined
> => {
  let statusCode: number;
  let searchResultArray: ItemPropsWithID[] = [];
  try {
    const boardDB = collection(db, "Inventory");
    const searchQuery = query(boardDB);
    const querySnapshot: any = await getDocs(searchQuery);
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
    }
    statusCode = 200;
    return { statusCode, searchResultArray };
  } catch (err) {
    statusCode = 501;
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
export const handleSingleItem = async (
  id: string
): Promise<{ statusCode: number; singleItem: GridItem } | any> => {
  let singleItem: GridItem;
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
        location: querySnapshot.data().location,
        interestedParties: querySnapshot.data().interestedParties,
      };
      return { statusCode: 200, singleItem };
    } else {
      console.log("No such document!");
      return { statusCode: 200, singleItem: { error: "No such Item exist!" } };
    }
  } catch (error: any) {
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
export const handleInterest = async (data: {
  id: string;
  userId: string;
  giverId: string;
  itemId: string;
  itemName: string;
  pickupAddress: string;
  recipientId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
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
    return { statusCode: 200, message: "The donation item has been successfully updated." };
  } catch (error: any) {
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Recipient shows interest in a Donated item (Protected route)
export const handlePotentialInterest = async (data: {
  id: string;
  userId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const interestRef = doc(db, "Inventory", data.id);
    console.log(data.userId, "error handle interest")
    const checkRef = await getDoc(interestRef);
    if (checkRef.data()?.interestedParties.length < 5) {
      const res = await setDoc(
        interestRef,
        {
          interestedParties: arrayUnion(data.userId),
        },
        { merge: true }
      );
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
    
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// Recipient removes interest from an donated item (Protected route)
export const handleRemoveInterest = async (data: {
  id: string;
  userId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
    const boardRef = doc(db, "Inventory", data.id);
    const res = await setDoc(
      boardRef,
      {
        interestedParties: arrayRemove(data.userId),
      },
      { merge: true }
    );
    return {
      statusCode: 200,
      message: "Your request for withdrawal has been approved. Please let us know if you need further assistance.",
    };
  } catch (error: any) {
    return { statusCode: 501, message: "Oops! an error occurred" };
  }
};

// User Catalog List show both donated and recieved items (Protected route)
export const handleCatalogList = async (
  userId: string
): Promise<{ statusCode: number; catalogList: GridItem[] } | undefined> => {
  let catalogList: GridItem[] = [];

  try {
    const catalogRef = collection(db, "Inventory");
    const catalogQuery = query(
      catalogRef,
      or(
        where("donor", "==", userId),
        where("interestedParties", "array-contains-any", [userId])
      )
    );
    const querySnapshot: any = await getDocs(catalogQuery);
    if (querySnapshot.docs.length > 0) {
      querySnapshot.docs.map((doc: any) => {
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
      });
    }
    return { statusCode: 200, catalogList };
  } catch (error: any) {
    console.log(error, "error");
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
export const handleConfirmDelivery = async (data: {
  itemId: string;
  donorId: string;
  recieverId: string;
}): Promise<{ statusCode: number; message: string } | undefined> => {
  try {
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
export const handleAddExpoToken = async (
  data: {userId: string, token: string}
): Promise<{ statusCode: number; message: string, token?: string } | undefined> => {
  try {
    const updateRef = doc(db, "Users", data.userId);

      await setDoc(
        updateRef,
        {
          expoPushToken: data.token,
        },
        { merge: true }
      );
      return { statusCode: 200, message: "Expo token successfully added!", token: data.token };
    
  } catch (error: any) {

    return { statusCode: 500, message:"Oops! an error occured" };
  }
};

// Update User - remove expo Token 
export const handleRemoveExpoToken = async (userId: string): Promise<{ statusCode: number; message: string, token?: string } | undefined> => {
  try {
    const updateRef = doc(db, "Users", userId);

      await setDoc(
        updateRef,
        {
          expoPushToken: "",
        },
        { merge: true }
      );
      return { statusCode: 200, message: "Expo token successfully removed!", token: "" };
    
  } catch (error: any) {

    return { statusCode: 500, message:"Oops! an error occured" };
  }
};


// Get user Data for Profile screen(Protected route)
export const handleUserData = async (
  userId: string
): Promise<{ statusCode: number; userData: userDataProps } | any> => {
  let userData: userDataProps;
  try {
    const userDataRef = doc(db, "Users", userId);

    const querySnapshot = await getDoc(userDataRef);

    if (querySnapshot.exists()) {
      userData = {
        id: userId,
        firstname: querySnapshot.data().firstname,
        lastname: querySnapshot.data().lastname,
        phone: querySnapshot.data().phone,
        email: querySnapshot.data().email,
        isVerified: querySnapshot.data().emailVerified,
        isActive: querySnapshot.data().isActive,
        donated: querySnapshot.data().donated,
        recieved: querySnapshot.data().recieved,
        expoPushToken: querySnapshot?.data()?.expoPushToken || "",
      };
      return { statusCode: 200, userData };
    } else {
      console.log("No such document!");
      return { statusCode: 200, userData: { error: "No such User exist!" } };
    }
  } catch (error: any) {
    return {
      statusCode: 501,
      singleItem: { error: "Oops! an error occurred" },
    };
  }
};