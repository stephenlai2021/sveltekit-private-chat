<script>
	import AddFriendModal from '$lib/components/AddFriendModal.svelte';
	import { showModal } from '$lib/store';
	import { db } from '$lib/firebase/client';
	import { collection, onSnapshot, query, where } from 'firebase/firestore';
	import { page } from '$app/stores';

	let q = null;
	let user = {};
	let users = [];
	let colRef = collection(db, 'whatzapp_users');
  
	$: if ($page.params.userId) {
		q = query(colRef, where('name', '==', $page.params.userId));
		const unsub = onSnapshot(q, (snapshot) => {
			let tempUsers = [];
			snapshot.docs.forEach((doc) => {
				tempUsers.push({ ...doc.data() });
			});
			user = tempUsers[0];
			return () => unsub();
		});
	}
</script>

<img
	src="https://github.com/stephenlai2021/whatzapp/blob/master/static/pattern.jpg?raw=true"
	alt=""
/>
{#if users}
	<div class="header">
		<div class="imgText">
			<div class="userimg">
				<img src={user.avatar} alt="" />
			</div>
			<div class="details">
				<h4>{user.name}</h4>
				<span>{user.isOnline ? 'online' : 'offline'}</span>
			</div>
		</div>
		<ul class="nav_icons">
			<li>
				<span class="material-icons">more_vert</span>
			</li>
		</ul>
	</div>
{/if}

<!-- chatbox -->
<div class="chatBox">
	<div class="message my_message">
		<p>Hi<br /><span>12:15</span></p>
	</div>
	<div class="message friend_message">
		<p>Hello<br /><span>12:18</span></p>
	</div>
	<div class="message my_message">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br /><span>12:15</span>
		</p>
	</div>
	<div class="message friend_message">
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium alias, optio quas
			voluptas consequuntur.<br /><span>12:18</span>
		</p>
	</div>
	<div class="message my_message">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br /><span>12:15</span>
		</p>
	</div>
	<div class="message friend_message">
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium alias, optio quas
			voluptas consequuntur.<br /><span>12:18</span>
		</p>
	</div>
	<div class="message my_message">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br /><span>12:15</span>
		</p>
	</div>
	<div class="message friend_message">
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium alias, optio quas
			voluptas consequuntur.<br /><span>12:18</span>
		</p>
	</div>
	<div class="message my_message">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br /><span>12:15</span>
		</p>
	</div>
	<div class="message friend_message">
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium alias, optio quas
			voluptas consequuntur.<br /><span>12:18</span>
		</p>
	</div>
	<div class="message my_message">
		<p>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, iure?<br /><span>12:15</span>
		</p>
	</div>
	<div class="message friend_message">
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iure accusantium alias, optio quas
			voluptas consequuntur.<br /><span>12:18</span>
		</p>
	</div>
</div>

<!-- chat input -->
<div class="chatbox_input">
	<span class="material-icons">insert_emoticon</span>
	<span class="material-icons">attach_file</span>
	<input type="text" placeholder="Type a message" />
	<span class="material-icons">mic_none</span>
</div>

{#if $showModal}
	<AddFriendModal />
{/if}

<style>
	.chatbox_input span:nth-child(1) {
		margin-right: 15px;
	}
	.chatbox_input input {
		width: 90%;
		margin: 0 20px;
		padding: 10px 20px;
		border: none;
		outline: none;
		border-radius: 30px;
		font-size: 1em;
		background: white;
		color: black;
	}
	.chatbox_input span {
		cursor: pointer;
		font-size: 1.8em;
		color: #51585c;
	}
	.chatbox_input {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 60px;
		background: #f0f0f0;
		padding: 15px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.message.friend_message p {
		background: #f5f5f5;
		justify-content: flex-start;
	}
	.my_message {
		justify-content: flex-end;
		text-align: right;
	}
	.message p span {
		display: block;
		margin-top: 5px;
		font-size: 0.85em;
		opacity: 0.5;
	}
	.message.friend_message::before {
		left: -12px;
		background: linear-gradient(225deg, #ededed 0%, #ededed 50%, transparent 50%, transparent);
	}
	.message.my_message::before {
		right: -12px;
		background: linear-gradient(135deg, #dcf8c6 0%, #dcf8c6 50%, transparent 50%, transparent);
	}
	.message::before {
		content: '';
		position: absolute;
		top: 0;
		width: 20px;
		height: 20px;
	}
	.message p {
		position: relative;
		right: 0;
		max-width: 65%;
		padding: 12px;
		background: #dcf8c6;
		border-radius: 10px;
		font-size: 0.9em;
		font-weight: 600;
	}
	.message {
		position: relative;
		display: flex;
		width: 100%;
		margin-bottom: 5px;
	}
	.chatBox {
		position: absolute;
		top: 60px;
		width: 100%;
		height: calc(100vh - 60px);
		padding: 20px;
		padding-bottom: 60px;
		overflow-y: auto;
	}
	.details {
		padding-left: 15px;
	}
	.rightSide .header .imgText {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.rightSide .header .imgText h4 {
		font-weight: 600;
		line-height: 1.2em;
		color: var(--icon-add-color);
		/* border: 1px solid green; */
	}
	.rightSide .header .imgText span {
		font-size: 0.8em;
		color: #555;
		/* border: 1px solid blue; */
	}
	.rightSide .header .imgText .userimg {
		display: flex;
	}
	.rightSide .header .imgText .userimg img {
		width: 40px;
		height: 40px;
		color: var(--icon-add-color);
		border-radius: 50%;
		opacity: 1;
	}
	/* @media (max-width: 700px) {
		.block {
			flex-wrap: wrap;
		}
		.block .imgbx {
			margin-right: 0;
		}
		.leftSide .header,
		.leftSide .search_user {
			display: none;
		}
		.chatlist {
			height: 100%;
		}
		.topSide {
			display: block;
		}
		.topSide .header .userimg {
			margin-right: 0;
		}
		.topSide .search_user {
			margin-left: 10px;
		}
	} */
</style>