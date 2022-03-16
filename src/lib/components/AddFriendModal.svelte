<script>
	import { fly } from 'svelte/transition';
	import { bgColor } from '$lib/store'
	import { showAddFriendModal } from '$lib/store'

	let keyword = '';
  
	const handleSubmit = () => {};
</script>

<div 
	class="modal-addfriend" 
	on:click|stopPropagation={() => console.log("hi, there !")}
	transition:fly={{ y: 50, duration: 100, delay: 100 }}	
>
<div class="icon-arrow">
	<ion-icon
		name="close-outline"
		on:click|stopPropagation={() => ($showAddFriendModal = false)}
	/>
</div>
	<div class="form-container">
		<div class="search_user">
			<div>
				<input type="text" placeholder="Search user" bind:value={keyword} />
				<span class="material-icons">search</span>
			</div>		
		</div>
	</div>
</div>

<style>
	.icon-arrow {
    display: flex;
    align-items: center;
    padding: 5px;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
  }

	.form-container {
		width: 100%;
		padding: 30px;
	}

	.search_user {
		position: relative;
		width: 100%;
		height: 50px;
		background: transparent;
		padding: 0 15px;
		line-height: 50px;
	}

	.search_user input {
		width: 100%;
		outline: none;
		border: none;
		background: white;
		padding: 6px;
		height: 38px;
		border-radius: 30px;
		font-size: 14px;
		padding-left: 40px;
	}

	.search_user input::placeholder {
		color: #bbb;
	}

	.search_user .material-icons {
		position: absolute;
		left: 25px;
		top: 15px;
		color: #bbb;
	}

	.modal-addfriend {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 200;
		width: 100%;
		height: 100vh;
		padding: 10px;
		z-index: 100;
		background: rgba(189, 202, 202, 0.5);
    backdrop-filter: blur(30px);
	}
</style>