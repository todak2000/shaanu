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

import { handlePasswordReset,
    handleSignInAuth,
    handleSignUpAuth,
    handleSignOut
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
    setLoading(false)
 })
};


```
