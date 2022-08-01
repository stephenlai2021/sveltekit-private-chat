<script>
  import {
    collection,
    query,
    where,
    onSnapshot,
    doc,
    getDoc,
    setDoc,
    updateDoc,
  } from "firebase/firestore";
  import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { auth, db } from "$lib/firebase/client";
  import { fly, fade } from "svelte/transition";
  import { loginWithGoogle } from "$lib/functions/auth/google";
  import { bgColor, userList } from "$lib/store";
  import { updateProfile } from "firebase/auth";
  import { loginState, loggedinUser, loginUserEmail } from "$lib/store";
  // import themeStore from 'svelte-themes'

  let users = [];
  let name = "";
  let email = "";
  let password = "";
  let error = null;
  let signup = false;
  let isLogin = false;
  let result = null;
  let userRef = null;
  let errorMsg = "";
  let warningMsg = null;
  let emailErrMsg = null;
  let passwordErrMsg = null;
  let colRef = collection(db, "whatzapp_users");

  /*
    collection = whatzapp_users
    document id = stephenlai2015@gmail.com    
    field = {
      avatar: "https://lh3.googleusercontent.com/a-/AOh14GgSxu4x8DUiNMF2s_d5ih3PmIt62v75f1af5iIpow=s96-c"
      avatarPath: null,
      contactList: ["batman@mail.com"],
      createdAt: xxx,
      email: "stephenlai2015@gmail.com",
      isOnline: true,
      name: "Mask Man",
      uid: "IYZK6CoIcKb8CEpr5sJMgMTF8BK2",
      unread: true
    }
  */

  /*
    firebase auth error
    signup
    - code: auth/invalid-email; message: Firebase: Error (auth/invalid-email)
    - code: auth/weak-password; message: Firebase: Password should be at least 6 characters
    
    login
    - code: auth/user-not-found; message: Firebase: Error (auth/user-not-found)
    - code: auth/wrong-password; message: Firebase: Error (auth/wrong-password).
  */

  const checkUsername = async () => {
    if (signup) {
      console.log("user name: ", name);
      const q = query(colRef, where("name", "==", name));
      const unsub = onSnapshot(q, async (snapshot) => {
        let tempUsers = [];
        snapshot.docs.forEach((doc) => {
          tempUsers.push({ ...doc.data() });
        });
        users = tempUsers;
        console.log("get user list", users);

        if (users.length === 0) {
          users = [];
          console.log(`${name} is available 😀`);
          handleSignup();
        }
        if (users.length != 0) {
          console.log(`${name} is already in use 😆`);
          warningMsg = "This name is already in use 😆";
          users = [];
          return;
        }
        return () => unsub();
      });
    }
    if (!signup) handleLogin();
  };

  const handleSignup = async () => {
    try {
      // add maskman to signedup user's constact list
      // add signedup user's email to maskman's contact list
      try {
        const maskmanRef = doc(db, "whatzapp_users", "maskman@mail.com");
        const maskmanSnap = await getDoc(maskmanRef);
        await updateDoc(maskmanRef, {
          contactList: [...maskmanSnap.data().contactList, email],
        });
        console.log("maskman is added to user contact list");
      } catch (err) {
        console.log(`error code: `, err.message);
        console.log(`error message: `, err.message);
      }

      // get signedup user profile
      try {
        result = await createUserWithEmailAndPassword(auth, email, password);
        console.log(`${result.user.email} signed up successfully 🙂`);
        $loginState = true;
        $loginUserEmail = result.user.email;
      } catch (err) {
        console.log(`error code: `, err.code);
        console.log(`error message: `, err.message);
        errorMsg = err.code;
      }

      // update displayName of signedup user profile
      try {
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        console.log(`${auth.currentUser.email} displayName is updated 🙂`);
      } catch (err) {
        console.log(`error code: `, err.code);
        console.log(`error message: `, err.message);
      }

      // add signedup user to maskman's contact list
      let userRef = doc(db, "whatzapp_users", email);
      try {
        await setDoc(userRef, {
          avatar: result.user.photoURL,
          avatarPath: null,
          // contactList: ["stephenlai2015@gmail.com"],
          contactList: [],
          createdAt: Date.now().toLocaleString(),
          email: result.user.email,
          isOnline: true,
          name: name,
          password,
          uid: result.user.uid,
          unread: true,
        });
        console.log(`${result.user.email} document is created 🥰`);
      } catch (err) {
        console.log(`error code: `, err.code);
        console.log(`error message: `, err.message);
      }
    } catch (err) {
      console.log("Error Code: ", err.code);
      console.log("Error Message: ", err.message);
      error = err.message;
    }
  };

  const handleLogin = async () => {
    isLogin = true;
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
      console.log(`${result.user.email} signed in successfully 😙`);
      $loginState = true;
      // $loggedinUser = result.user
      $loginUserEmail = result.user.email;
      console.log("loggedin user email: ", $loginUserEmail);

      userRef = doc(db, "whatzapp_users", result.user.email);
      await updateDoc(userRef, {
        isOnline: true,
      });
      console.log(`update ${result.user.email}'s status -> 🟢`);
      isLogin = false
    } catch (err) {
      console.log(`error code: `, err.code);
      console.log(`error message: `, err.message);
      errorMsg = err.code;
      isLogin = false
    }
  };

  const handleLoginSignup = () => {
    if (signup) handleSignup();
    if (!signup) handleLogin();
  };

  const clearUsername = () => (warningMsg = null);

  $: if (errorMsg) {
    if (
      errorMsg === "auth/invalid-email" ||
      errorMsg === "auth/user-not-found" ||
      errorMsg === "auth/email-already-in-use"
    )
      emailErrMsg = errorMsg;
    if (errorMsg === "auth/weak-password" || errorMsg === "auth/wrong-password")
      passwordErrMsg = errorMsg;
  }

  $: console.log(signup ? "You are in signup page" : "You are in login page");
</script>

<!-- <section transition:fade> -->
<section>
  {#if !isLogin}
    <div class="main">
      <div class="logo-wrapper">
        <img
          src="https://www.hosteurope.de/blog/wp-content/uploads/2020/11/abbildung_-_das-offizielle-svelte-logo.jpg"
          alt=""
          class="logo"
        />
      </div>

      <form on:submit|preventDefault={checkUsername}>
        <div class="top">
          <div class="btn btn-login" on:click={() => (signup = false)}>
            Login
          </div>
          <div class="btn btn-signup" on:click={() => (signup = true)}>
            Signup
          </div>
        </div>
        <div class="body">
          {#if signup}
            <input
              type="text"
              class="user-name"
              placeholder="name"
              required
              bind:value={name}
            />
          {/if}
          <input
            type="email"
            class="user-email"
            placeholder="email"
            required
            bind:value={email}
          />
          <input
            type="password"
            class="user-password"
            placeholder="password"
            required
            bind:value={password}
          />
        </div>
        <div class="btn-action" on:click={handleLoginSignup}>
          {signup ? "signup" : "login"}
        </div>
        <div class="btn-facebook">
          <img
            class="icon-facebook"
            src="https://upload.wikimedia.org/wikipedia/commons/f/fb/Facebook_icon_2013.svg"
            alt=""
          />
          <p>Login with Facebook</p>
        </div>
      </form>
    </div>
    {/if}
    <p class="error-message">{errorMsg}</p>

  {#if isLogin}
    <div class="loading-indicator">
      <div class="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  {/if}
</section>

<style>
  :root {
    --title-grey: #607d8b;
    --logo-green: #42d39b;
    --bg-red: #e91e63;
    --bg-purple: #03a9f4;
    --btn-red: #ff4584;
    --btn-red-hover: #f53677;
    --facebook-blue: #3a559f;
    --facebook-blue: #3d5998;
  }

  form {
    margin-top: 5px;
  }

  .error-message {
    text-align: center;
    color: red;
    margin-top: 20px;
  }

  .icon-facebook {
    width: 35px;
    height: 35px;
  }

  .btn-facebook p {
    color: white;
    margin-left: 35px;
    font-weight: 600;
  }

  .btn-facebook {
    display: flex;
    align-items: center;
    position: relative;
    background: var(--facebook-blue);
    padding: 4px;
    margin-top: 10px;
    border-radius: 2px;
  }

  .btn,
  .btn-action {
    cursor: pointer;
  }

  .btn-action {
    padding: 12px;
    margin-top: 10px;
    text-align: center;
    color: white;
    background: rgb(187, 195, 206);
    border-radius: 2px;
  }

  input {
    outline: none;
    width: 100%;
    padding: 12px 12px;
    border: 1px solid rgb(243, 242, 242);
  }

  .btn-login {
    border-top: 1px solid rgb(243, 242, 242);
    border-left: 1px solid rgb(243, 242, 242);
  }

  .btn-signup {
    color: gray;
    background: rgb(243, 242, 242);
  }

  .btn {
    width: 50%;
    text-align: center;
    padding: 10px;
  }

  .top {
    display: flex;
  }

  .logo-wrapper {
    text-align: center;
  }

  .logo {
    height: 60px;
  }

  section {
    width: 100vw;
    max-width: 1920px;
    height: 100vh;
    background: #fff;
  }

  .loading-indicator {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .main {
    position: relative;
    width: 300px;
    margin: 200px auto;
    overflow-y: auto;
  }  
</style>
