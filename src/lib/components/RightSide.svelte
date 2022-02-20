<script>
	import { showModal } from '$lib/store';
	import AddFriendModal from '$lib/components/AddFriendModal.svelte';
</script>

<img
	src="https://github.com/stephenlai2021/whatzapp/blob/master/static/pattern.jpg?raw=true"
	alt=""
/>
<div class="header">
	<div class="imgText">
		<div class="userimg">
			<img src="https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png" alt="" />
		</div>
		<h4>Stephen Lai<br /><span>online</span></h4>
	</div>
	<ul class="nav_icons">
		<li>
			<span class="material-icons">more_vert</span>
		</li>
	</ul>
</div>
{#if $showModal}
	<AddFriendModal />
{/if}

<style>
	.rightSide .header .imgText {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.rightSide .header .imgText h4 {
		font-weight: 600;
		line-height: 1.2em;
		margin-left: 15px;
		color: var(--icon-add-color);
	}
	.rightSide .header .imgText h4 span {
		font-size: 0.8em;
		color: #555;
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