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
  import { fly } from "svelte/transition";
  import { loginWithGoogle } from "$lib/functions/auth/google";
  import { bgColor, userList } from "$lib/store";
  import { updateProfile } from "firebase/auth";
  //   import { profileUpdate, userDocCreated } from "$lib/store";
  import { loginState, loginUserEmail } from "../store";

  let users = [];
  let name = "";
  let email = "";
  let password = "";
  let error = null;
  let signup = false;
  let result = null;
  let userRef = null;
  let errorMsg = null;
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
      console.log('user name: ', name)
      const q = query(colRef, where("name", "==", name));
      const unsub = onSnapshot(q, async (snapshot) => {
        let tempUsers = [];
        snapshot.docs.forEach((doc) => {
          tempUsers.push({ ...doc.data() });
        });
        users = tempUsers;
        console.log("get user list", users);

        if (users.length === 0) {
          users = []
          console.log(`${name} is available 😀`)
          handleSignup()
        }
        if (users.length != 0) {
          console.log(`${name} is already in use 😆`);
          warningMsg = "This name is already in use 😆";
          users = []
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
    try {
      result = await signInWithEmailAndPassword(auth, email, password);
      console.log(`${result.user.email} signed in successfully 😙`);
      $loginState = true;
      $loginUserEmail = result.user.email;

      userRef = doc(db, "whatzapp_users", result.user.email);
      await updateDoc(userRef, {
        isOnline: true,
      });
      console.log(`update ${result.user.email}'s status -> 🟢`);
    } catch (err) {
      console.log(`error code: `, err.code);
      console.log(`error message: `, err.message);
      errorMsg = err.code;
    } 
  };

  const clearUsername = () => warningMsg = null;

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

<section>
  <div class="imgBx">
    <img src="/login-bg.jpg" alt="" />
  </div>
  <div class="contentBx">
    <div class="formBx">
      <h2>
        {signup ? "signup" : "login"}
      </h2>
      <form on:submit|preventDefault={checkUsername}>
        {#if signup}
          <div class="inputBx">
            <span>Username</span>
            <input
              type="text"
              bind:value={name}
              on:input={clearUsername}
              required
            />
            {#if warningMsg}
              <p class="error-msg" style:color="red">{warningMsg}</p>
            {/if}
          </div>
        {/if}
        <div class="inputBx">
          <span>Email</span>
          <input
            type="email"
            bind:value={email}
            on:input={() => (emailErrMsg = null)}
            required
          />
          {#if errorMsg && emailErrMsg}
            <p class="error-msg" style:color="red">{emailErrMsg}</p>
          {/if}
        </div>
        <div class="inputBx">
          <span>Password</span>
          <input
            type="password"
            bind:value={password}
            on:input={() => (passwordErrMsg = null)}
            required
          />
          {#if passwordErrMsg}
            <p class="error-msg" style:color="red">{passwordErrMsg}</p>
          {/if}
        </div>
        <div class="remember">
          <label>
            <input type="checkbox" />Remember me
          </label>
        </div>
        <div class="inputBx btn-submit">
          <input type="submit" value={signup ? "Sign up" : "Login in"} />
        </div>
        <div class="inputBx">
          <p>
            Don't have an account?
            <span
              class="toggle"
              on:click={() => (signup = !signup)}
              style:color={$bgColor}
            >
              {signup ? "Login" : "Sign up"}
            </span>
          </p>
        </div>
      </form>
      <h3 class:mt={!signup}>Login with social media</h3>
      <ul class="sci">
        <li on:click={loginWithGoogle}>
          <img src="/google.png" alt="" />
        </li>
        <li>
          <img src="/facebook.png" alt="" />
        </li>
        <li>
          <img src="/instagram.png" alt="" />
        </li>
      </ul>
    </div>
  </div>
</section>

<style>
  @import url("$lib/styles/login.css");
</style>
