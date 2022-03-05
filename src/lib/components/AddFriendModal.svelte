<script>
	import { fly } from 'svelte/transition';
	import { bgColor } from '$lib/store'

	let keyword = '';
  
	const handleSubmit = () => {};
</script>

<div 
	class="modal-addfriend" 
	style:background={$bgColor}
	on:click|stopPropagation={() => console.log("hi, there !")}
	transition:fly={{ y: 50, duration: 150, delay: 150 }}	
>
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
		/* border: 1px solid; */
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
		display: flex;
		justify-content: center;
		z-index: 100;
		/* background: #e5ddd5; */
		background: rgba(189, 202, 202, 0.5);
    backdrop-filter: blur(30px);
		/* border: 1px solid green; */
	}

	/* @media (max-width: 700px) {
		.add-friend {
			width: 122%;
		}
	} */
</style>