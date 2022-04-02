<script>
  import { doc, setDoc } from "firebase/firestore";
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
  } from "firebase/auth";
  import { auth, db } from "$lib/firebase/client";
  import { fly } from "svelte/transition";
  import { loginWithGoogle } from "$lib/functions/auth/google";
  import { bgColor } from "$lib/store";

  let displayName = "";
  let email = "";
  let password = "";
  let error = null;
  let signup = false;
  let isPending = false;
  let result = null;

  const handleSubmit = async () => {
    try {
      if (signup) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        console.log("user | signup", result);
        let userRef = doc(db, "whatzapp_users", result.user.displayName);
        await setDoc(userRef, {
          uid: result.user.uid,
          displayName,
          email,
          // createdAt: Date.now().toLocaleString(),
          isOnline: true,
          avatar: result.user.photoURL,
        });
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
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
      console.log(err.message);
      error = err.message;
      isPending = false;
    }
  };
</script>

<section>
  <!-- <style>
    .imgBx:before {
      background: var(--bg);
    }
  </style>
  <div class="imgBx" style="--bg: {$bgColor}"> -->
  <div class="imgBx">
    <img src="/login-bg.jpg" alt="" />
  </div>
  <div class="contentBx">
    <div class="formBx">
      <!-- <h2 style:border-bottom="4px solid {$bgColor}"> -->
      <h2>
        {signup ? "signup" : "login"}
      </h2>
      <form on:submit|preventDefault={handleSubmit}>
        {#if signup}
          <div class="inputBx">
            <span>Username</span>
            <input type="text" bind:value={displayName} />
          </div>
        {/if}
        <div class="inputBx">
          <span>Email</span>
          <input type="email" bind:value={email} />
        </div>
        <div class="inputBx">
          <span>Password</span>
          <input type="password" bind:value={password} />
        </div>
        <div class="remember">
          <label>
            <input type="checkbox" />Remember me
          </label>
        </div>
        <div class="inputBx btn-submit">
          <input type="submit" value={signup ? 'Sign up' : 'Sign in'} />
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
