<script>
	import { doc, setDoc } from 'firebase/firestore';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		signInWithPopup,
		GoogleAuthProvider
	} from 'firebase/auth';
	import { auth, db, google } from '$lib/firebase/client';
	let displayName = '';
	let email = '';
	let password = '';
	let error = null;
	let signup = false;
	let isPending = false;
	let result = null;
	const handleSubmit = async () => {
		try {
			if (signup) {
				result = await createUserWithEmailAndPassword(auth, email, password);
				console.log('user | signup', result);
				let userRef = doc(db, 'whatzapp_users', result.user.displayName);
				await setDoc(userRef, {
					uid: result.user.uid,
					displayName,
					email,
					// createdAt: Date.now().toLocaleString(),
					isOnline: true,
					avatar: result.user.photoURL
				});
			} else {
				result = await signInWithEmailAndPassword(auth, email, password);
			}
			if (!result) {
				if (signup) {
					throw new Error('Could not complete signup !');
				} else {
					throw new Error('Could not complete login !');
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
	let token = null;
	const loginWithGoogle = () => {
		signInWithPopup(auth, google)
			.then((result) => {
				let user = result.user;
				console.log('current loggedin user', user);
				console.log('current loggedin user id ', auth.currentUser.uid);			
			})
			.catch((err) => {
				console.log(err.message);
			});
	};
</script>

<div class="page">
	<div class="content">
		<header>{signup ? 'Signup' : 'Login'} Form</header>
		<form on:submit|preventDefault={handleSubmit}>
			{#if signup}
				<div class="field">
					<span class="material-icons">insert_emoticon</span>
					<input
						required
						type="text"
						displayName="name"
						bind:value={displayName}
						placeholder="Name"
					/>
				</div>
			{/if}
			<div class="field space">
				<span class="material-icons">email</span>
				<input required type="text" name="email" bind:value={email} placeholder="Email" />
			</div>
			<div class="field space">
				<span class="material-icons">lock</span>
				<input
					required
					type="text"
					name="password"
					class="password"
					bind:value={password}
					placeholder="Pawword"
				/>
				<span class="show">SHOW</span>
			</div>
			<div class="pass">
				<a href="#">Forgot Password</a>
			</div>
			<div class="field">
				<input type="submit" value={signup ? 'SIGNUP' : 'LOGIN'} />
			</div>
			<div class="login">Or {signup ? 'signup' : 'login'} with</div>
			<div class="link">
				<div class="google" on:click={loginWithGoogle}>
					<div class="img-container">
						<img
							src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Google_Chrome_icon_%282011%29.svg/768px-Google_Chrome_icon_%282011%29.svg.png"
							alt="google icon"
						/>
					</div>
					<h4>Google</h4>
				</div>
			</div>
			<div class="signup">
				Don't have account ?
				<span on:click={() => (signup = !signup)}>{signup ? 'Login' : 'Signup'} Now</span>
			</div>
			{#if error}
				<p class="error">{error}</p>
			{/if}
		</form>
	</div>
</div>

<style>
	:root {
		--form-bg-color: #e8f0fe;
	}
	.page {
		display: flex;
		justify-content: center;
	}
	.content {
		min-width: 350px;
		margin-top: 20px;
		text-align: center;
	}
	.content header {
		color: var(--dark-mode-text);
		font-size: 30px;
		font-weight: 600;
		margin: 0 0 35px 0;
		font-family: 'Montserrat', sans-serif;
	}
	.field {
		position: relative;
		height: 45px;
		width: 100%;
		display: flex;
		/* background: rgba(255, 255, 255, 0.04); */
		background: var(--form-bg-color);
	}
	.field span {
		color: #222;
		background: var(--form-bg-color);
		width: 40px;
		line-height: 45px;
		/* border: none;
		outline: none; */
	}
	.field input {
		height: 100%;
		width: 100%;
		background: var(--form-bg-color);
		/* background: transparent; */
		border: none;
		outline: none;
		color: #222;
		font-size: 16px;
		font-family: 'Poppins', sans-serif;
	}
	.show {
		position: absolute;
		right: 13px;
		font-size: 13px;
		font-weight: 700;
		color: #222;
		cursor: pointer;
		display: none;
		font-family: 'Montserrat', sans-serif;
	}
	.space {
		margin-top: 16px;
	}
	.pass {
		text-align: left;
		margin: 10px 0;
	}
	.pass a {
		color: var(--dark-mode-text);
		font-family: 'Poppins', sans-serif;
		text-decoration: none;
	}
	.pass:hover a {
		text-decoration: underline;
	}
	input[type='submit'] {
		background: #3498db;
		border: 1px solid #2691d9;
		color: white;
		font-size: 18px;
		letter-spacing: 1px;
		font-weight: 600;
		cursor: pointer;
		font-family: 'Montserrat', sans-serif;
	}
	input[type='submit']:hover {
		background: #2691d9;
	}
	.login {
		color: var(--dark-mode-text);
		margin: 20px 0;
		font-family: 'Poppins', sans-serif;
	}
	.link {
		display: flex;
		cursor: pointer;
		color: white;
		margin: 0 0 20px 0;
	}
	.google {
		width: 100%;
		height: 45px;
		line-height: 45px;
		margin-top: 10px;
		background: var(--google-bg-color);
		display: flex;
		position: relative;
	}
	.google .img-container {
		position: absolute;
		left: 0;
		width: 50px;
		height: 45px;
		/* border: 1px solid; */
		display: grid;
		place-content: center;
	}
	.google img {
		width: 25px;
		height: 25px;
	}
	.google h4 {
		width: 100%;
		font-family: 'Poppins', sans-serif;
	}
	.signup {
		color: var(--dark-mode-text);
	}
	.signup span:hover {
		text-decoration: underline;
		cursor: pointer;
	}
	.error {
		margin-top: 10px;
	}
</style>