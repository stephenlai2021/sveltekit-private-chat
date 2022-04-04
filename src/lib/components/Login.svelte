<script>
  import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
  import { profileUpdate } from "$lib/store";

  let name = "";
  let email = "";
  let password = "";
  let user = null;
  let error = null;
  let signup = false;
  let isPending = false;
  let result = null;
  let userRef = null;

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

  const initialUserList = async (email) => {
    const maskmanRef = doc(db, "whatzapp_users", "stephenlai2015@gmail.com");
    const maskmanSnap = await getDoc(maskmanRef);
    console.log("maskman profile", maskmanSnap.data());
    updateDoc(maskmanRef, {
      contactList: [...maskmanSnap.data().contactList, email],
    });
  };

  const handleSubmit = async () => {
    try {
      if (signup) {
        // result = await createUserWithEmailAndPassword(auth, email, password);
        // initialUserList(email);

        // updateProfile(auth.currentUser, {
        //   displayName: name,
        // })
        //   .then(() => {
        //     console.log("user profile updated !");
        //     $profileUpdate = true;
        //   })
        //   .catch((error) => {
        //     console.log("OOH, something went wrong ! 😱", error);
        //   });

        // userRef = doc(db, "whatzapp_users", email);
        // setDoc(userRef, {
        //   avatar: result.user.photoURL,
        //   avatarPath: null,
        //   contactList: [],
        //   createdAt: Date.now().toLocaleString(),
        //   email: result.user.email,
        //   isOnline: true,
        //   name: name,
        //   uid: result.user.uid,
        //   unread: true,
        // });

        const maskmanRef = doc(
          db,
          "whatzapp_users",
          "stephenlai2015@gmail.com"
        );
        const maskmanSnap = await getDoc(maskmanRef);
        updateDoc(maskmanRef, {
          contactList: [...maskmanSnap.data().contactList, email],
        }).then(() => {
          createUserWithEmailAndPassword(auth, email, password)
          .then((result) => {
            updateProfile(auth.currentUser, {
              displayName: name,
            })
              .then(() => {
                console.log("user profile updated !");
                $profileUpdate = true;
              })
              .catch((error) => {
                console.log("OOH, something went wrong ! 😱", error);
              });    
            userRef = doc(db, "whatzapp_users", email);
            setDoc(userRef, {
              avatar: result.user.photoURL,
              avatarPath: null,
              contactList: [],
              createdAt: Date.now().toLocaleString(),
              email: result.user.email,
              isOnline: true,
              name: name,
              uid: result.user.uid,
              unread: true,
            });
          })
        })
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
        userRef = doc(db, "whatzapp_users", auth.currentUser.email);
        await updateDoc(userRef, {
          isOnline: true,
        });
      }
      if (!result) {
        if (signup) {
          throw new Error("Could not complete signup !");
        } else {
          throw new Error("Could not complete login !");
        }
      }
      error = null;
      isPending = false;
    } catch (err) {
      console.log('Error Code: ', err.code);
      console.log('Error Message: ', err.message);
      error = err.message;
      isPending = false;
    }
  };
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
      <form on:submit|preventDefault={handleSubmit}>
        {#if signup}
          <div class="inputBx">
            <span>Username</span>
            <input type="text" bind:value={name} required />
          </div>
        {/if}
        <div class="inputBx">
          <span>Email</span>
          <input type="email" bind:value={email} required />
        </div>
        <div class="inputBx">
          <span>Password</span>
          <input type="password" bind:value={password} required />
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
