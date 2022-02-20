<script>
	import Skeleton from '$lib/components/Skeleton.svelte';
	import { keyword, showModal } from '$lib/store';
	import { goto } from '$app/navigation';
  import { onMount } from 'svelte'
  import { page } from '$app/stores'
	export let user, users, filteredUsers;
  let activeItem = user.uid
	const selectedUser = (user) => {
		activeItem = user.name;
		goto(`/${user.name}`);
	};
  onMount(() => {
    activeItem = $page.params.userId
    console.log('active item | onMount ', activeItem)
  })
</script>

<div class="leftSide">
	<div class="header">
		{#if user}
			<div class="left">
				<div class="userimg">
					<img class="cover" src={user.photoURL} alt="" />
				</div>
				<div class="user-details">
					<h4 class="user-title">{user.displayName}</h4>
					<div class="user-email">{user.email}</div>
				</div>
			</div>
		{/if}
		<ul class="nav_icons">
			<li on:click={() => ($showModal = !$showModal)}>
				<span class="material-icons">person_add_alt</span>
			</li>
		</ul>
	</div>
	<div class="search_user">
		<div>
			<input type="text" placeholder="Find user" bind:value={$keyword} />
			<span class="material-icons">search</span>
		</div>
	</div>
	{#if users.length}
		<div class="chatlist">
			{#each filteredUsers as user}
				<div
					class="block"
					class:unread={user.unread}
					class:active={activeItem === user.name}
					on:click={() => selectedUser(user)}
				>
					<div class="imgbx">
						<img src={user.avatar} alt="" class="cover" />
					</div>
					<div class="details">
						<div class="listHead">
							<h4>{user.name}</h4>
							<p class="time">10:56</p>
						</div>
						<div class="message_p">
							<p>How to make Whatsapp clone using html and css</p>
							<b>1</b>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="loading">
			<Skeleton />
		</div>
	{/if}
</div>