# Shaanu api documentation

Shaanu Backend was developed with Firebase and all api can be found within
`app/db/apis`.
it would require that the Firebase api keys and other variables be used. Kindly refer to `.env.example` for guidance.

## Installation and running of the app

    provided you follow the instructions here: `README.md`. you have nothing else to do

# REST API

The REST API endpoints to the Shaanu app is described below.

## Signup 

**handleSignUpAuth()**

**Description:**

The `handleSignUpAuth` function is used to sign up a new user.

**Parameters:**

```
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  password: string;

```

**Returns:**

An email is sent to the registered account for verification and a promise that resolves with the following object:

```
  {
    statusCode: number, 
    userData: {
        firstname: string; 
        lastname: string;  
        phone: string;  
        email: string; 
        isVerified: boolean;
    }
  }
```

## Signin

**handleSignInAuth()**

**Description:**

The `handleSignInAuth` function is used to sign in a registered user.

**Parameters:**

```
  email: string;
  password: string;

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    userData: {
        firstname: string; 
        lastname: string;  
        phone: string;  
        email: string; 
        isVerified: boolean;
    }
  }
```

## Signout

**handleSignOut()**

**Description:**

The `handleSignOut` function is used to sign out a registered user. No paramter is required. Upon a successful signout, the user loses access to protected routes.

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
  }
```

## Reset Password 

**handlePasswordReset()**

**Description:**

The `handlePasswordReset` function is used to send email to a registered user who has lost access to his/her account and want to retrieve such account. The email contains details to enable account owner re-set the account details accordingly.

**Parameters:**

```
  email: string

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
  }
```

## Search Donated Items (Protected)

**handleSearch()**

**Description:**

The `handleSearch` function is used to search for specific item from the Donation Inventory database. It accepts the value of the query and return an array of results or none.
**Parameters:**

```
  queryItem: string

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    searchResultArray: {
        id?: string | undefined;
        category: string;
        name: string;
        imageUrl: string[];
        pickupAddress: string;
        donor: string;
        status: string;
        reciever: string;
        location: string;
        interestedParties: string[];
    }[]
  }
```

## Donate Item (Protected)

**handleDonate()**

**Description:**

The `handleDonate` function is used to add donation item to the Donation Inventory database. It accepts an object containing one donated item data and return an array of results or none.
**Parameters:**

```
    {
    category: string;
    name: string;
    imageUrl: string[];
    pickupAddress: string;
    donor: string;
    status: string;
    reciever: string;
    location:string;
    interestedParties: string[];
}

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    message: string
  }
```

## Get Donation List (Protected)

**handleDonationList()**

**Description:**

The `handleDonationList` function is used to get all donation items from the Donation Inventory database. It return an array of results or none.

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    resultArray:  {
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
    }[]
  }
```


## Select Single Donate Item (Protected)

**handleSingleItem()**

**Description:**

The `handleSingleItem` function is used to select a single donated item. This is useful on the dashboard where all donated items are displayed. A user can click on any item and this api is involked. It accepts the item id and return an array of results or none.
**Parameters:**

```
    {
    id: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    message: string
  }
```

## Select Recipient - Donor (Protected)

**handleInterest()**

**Description:**

The `handleInterest` function is used to select the recipient of a donated Item. Only a donor of an item can access this function or invoke it. It accepts the item id, the selected recipient id and return a message and statuscode.
**Parameters:**

```
    {
    id: string
    userId: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    message: string
  }
```

##  Show Interest in an Item - Recipient (Protected)

**handlePotentialInterest()**

**Description:**

The `handlePotentialInterest` function is used to indicate interest in an item by a potential recipient. Only a Potential Recipients of an item can access this function or invoke it. It accepts the item id, the selected recipient id and return a message and statuscode.
**Parameters:**

```
    {
    id: string
    userId: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    message: string
  }
```

##  Show Disinterest in an Item - Recipient (Protected)

**handleRemoveInterest()**

**Description:**

The `handleRemoveInterest` function is used to indicate disinterest in an item by a potential recipient. Only a Potential Recipients of an item can access this function or invoke it. It accepts the item id, the selected recipient id and return a message and statuscode.
**Parameters:**

```
    {
    id: string
    userId: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    message: string
  }
```

## Get Catalog List (Protected)

**handleCatalogList()**

**Description:**

The `handleCatalogList` function is used to get all donation items from the Donation Inventory database specific to a user (Reciepient or Donor). It accepts the user id and return an array of results or none.

**Parameters:**

```
    {
    userId: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number, 
    resultArray:  {
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
    }[]
  }
```

## User Delete/Deactivate Account (Protected)

**handleDeleteAccount()**

**Description:**

The `handleDeleteAccount` function is used to delete user account as activated by the user. It requires that the user re-login into the app to verify that the user indeed wants to delete the account upon first initialization of the endpoint. If user relogins and initialize this endpoint again, the user's details wouldl be deleted immediately from the database. It accepts the user id and return result status code.

**Parameters:**

```
    {
    userId: string
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number
  }
```

## Donor Removes a Potential Recipient/Reciever of Donated Item (Protected)

**handleRemoveReciever()**

**Description:**

The `handleRemoveReciever` function is used to remove a potential reciever/recipeint from the interested parties list at the discretion of the donor. It accepts the the item ID and receiver ID and return result status code and message.

**Parameters:**

```
  {
    id: string;
    recipientId: string;
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number;
    message: string 
  }
```

## Get all chat between a Donor and Recipent (Protected)

**handleGetAllChat()**

**Description:**

The `handleGetAllChat` function is used to get all chat data between a donor and a recipient. It accepts the the chat ID and return result status code and chat data.

**Parameters:**

```
  {
    chatId: string;
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number;
    chatData: {
      chatId: string;
      donorId: string;
      recipientId: string;
      itemName: string;
      chatCorrespondence:  {
        userId: string;
      }[];
    }
  }
```

## Update Chat between a Donor and Recipeint (Protected)

**handleUpdateChat()**

**Description:**

The `handleUpdateChat` function is used to update chat between a donor and a recipient. It accepts the the chat ID, user ID as messenger and the message sent. It return result status code and status message.

**Parameters:**

```
  {
    chatId: string;
    messengerId: string;
    message: string;
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number;
    message: string;
  }
```

## Recipeint Confirm Delivery of Item (Protected)

**handleConfirmDelivery()**

**Description:**

The `handleConfirmDelivery` function is used to confirm that the donated item is recieved successfully by the reciever/recipient.  It accepts the the item ID, donor ID and the reciever ID. It return result status code and status message.

**Parameters:**

```
  {
    chatId: string;
    messengerId: string;
    message: string;
  }

```

**Returns:**

A promise that resolves with the following object:

```
  {
    statusCode: number;
    message: string;
  }
```

**Status:**

The status of the responses. Possible values are:

- 201 - resource successfully created.
- 200 - resource successfully retrieved/sent.
- 400 - failed request.
- 401 - not authorized/ fail to authenticate user.
- 404 - resource not found.
- 409 - resource already exist.

**Example:**

```

import { 
    handlePasswordReset,
    handleSignInAuth,
    handleSignUpAuth,
    handleSignOut,
    handleDonate,
    handleSearch,
    handleDonationList,
    handleDeleteAccount,
    handleSingleItem,
    handleRemoveReciever,
    handleInterest,
    handlePotentialInterest,
    handleRemoveInterest,
    handleCatalogList,
    handleGetAllChat,
    handleUpdateChat,
    handleConfirmDelivery
 } from '../db/apis';
...
<!-- signup -->
const signup = async () => {
  const data = {
    email: 'test@testing.com',
    password: 'testdf111@@@',
    firstname: 'Test',
    lastname: 'Business',
    phoneNumber: '0192929292',
  };

  handleSignUpAuth(data).then(res =>{
    if (res?.statusCode === 200) {
        console.log(res?.userData)
    }
    else if (res?.statusCode === 409) {
        console.log("Oops! The email already exist in our databse. Please Signin")
    }
    else {
        console.log("Oops! an error occurred")
    }
 })
};

<!-- signin -->
const signin = async () => {
  const data = {
    email: 'test@testing.com',
    password: 'testdf111@@@',
  };
  handleSignInAuth(data).then(res =>{
    if (res?.statusCode === 200) {
        console.log(res?.userData)
    }
    else if (res?.statusCode === 404) {
        console.log("Oops! The email does not exist in our databse. Please Signup")
    }
    else if (res?.statusCode === 401) {
        console.log("Oops! You entered an wrong password")
    }
    else {
        console.log("Oops! an error occurred")
    }
 })
};

<!-- signout -->
const signout = async () => {
  handleSignOut();
  // redirect user to non-protected screen e.g. login
};

<!-- resetPassword -->
const sendResetpasswordEmail = async () => {
  handlePasswordReset(values).then(res =>{
    if (res === 200) {
        console.log("Password reset link has been sent to your email")
    }
    else if (res === 404) {
        console.log("Oops! The email does not exist in our databse. Please Signup")
    }
    else {
        console.log("Oops! an error occurred")
    }
 })
};

<!-- search Donated Items -->
const searchItem = async () => {
  await handleSearch(text).then((result: any ) => {
        console.log(result)
    });
};

<!-- Add Donation Item -->
const addDonation = async () => {
    const dat = {
        category: "Food",
        name:"Bread Toaster",
        imageUrl: ["https://picsum.photos/200", "https://picsum.photos/200", "https://picsum.photos/200",],
        pickupAddress:"No 5, Ade stree, Lagos",
        donor: "23423232",
        status: "Available",
        reciever: "",
        location:'LA',
        interestedParties: ["sdsds2323", "dfd45dfg233", "34343sdss"]
    }

    handleDonate(dat).then(res =>{
    if (res.statusCode === 200) {
        console.log(res.message);
    }
    else {
        console.log(res.message);
    }
 })
};

<!-- Get all Donated Items -->
const allDonatedItems = async () => {
  await handleDonationList().then((result: any ) => {
        console.log(result)
    });
};

<!-- Delete User account -->
const DeleteAccount = () => {
    handleDeleteAccount(userId).then((res) => {
      if (res === 501) {
        console.log("Initial attempt requiring user to login")
      } else if (res === 200) {
        console.log("account successfully deleted!");
      } else {
        console.log("Oops! Something went wrong");
      }
    });
  };

<!-- Get Single Item details -->
const handleGetSingleItemDetails = async () => {
    await handleSingleItem(itemId).then((res) => {
      if (res?.statusCode === 200) {
        console.log(res.singleItem);
      }
    });
  };

<!-- Remove recipient/reciever -->
const removeReciever = () => {
  const data = {
    id: "23232sdsds",
    recipientId: "453d34534",
  };
  handleRemoveReciever(data).then((res: any) => {
    console.log(res)
  });
};

<!-- Donor Pick a recipeint -->
const pickReciever = () => {
  const dat = {
    userId: "342422",
    id: "sdsd2323",

    giverId: "2342sfsdf",
    itemId: "sdsd2323",
    itemName: "A pack of Suit",
    pickupAddress: "No 2, Brown Street",
    recipientId: "342422",
  };
  handleInterest(dat).then((res)=>{
    console.log(res)
  })
};

<!-- Show interest in a donated Item -->
const showInterest = () => {
  const data = {
    id: "23232sdsds",
    userId: "453d34534",
  };
  handlePotentialInterest(data).then((res: any) => {
    console.log(res)
  });
};

<!-- Remove interest in a donated Item -->
const removeInterest = () => {
  const data = {
    id: "23232sdsds",
    userId: "453d34534",
  };
  handleRemoveInterest(data).then((res: any) => {
    console.log(res)
  });
};

<!-- Get List of donated/requested Item -->
const getCatalogList = () => {
  const userId: "453d34534";
  handleCatalogList(userId).then((res: any) => {
    console.log(res)
  });
};

<!-- Get All Chat Data between a Donor and Recipient -->
const getChatData = () => {
  const chatId: "453d34534";
  handleGetAllChat(chatId).then((res: any) => {
    console.log(res)
  });
};

<!-- Update Chat between a Donor and Recipient -->
const updateChatData = () => {
  const data = {
      chatId: "wes234324",
      messengerId: "25dfsdsads",
      message: "Hello!",
    };
  handleUpdateChat(data).then((res: any) => {
    console.log(res)
  });
};

<!-- Recipient confirming Delivery of Item -->
const confirmDelivery = () => {
  const data = {
      itemId: "wes234324",
      donorId: "25dfsdsads",
      recieverId: "323sdfsds",
    };
  handleConfirmDelivery(data).then((res: any) => {
    console.log(res)
  });
};

```
