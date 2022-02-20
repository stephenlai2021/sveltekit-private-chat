<script>
  import { onMount } from "svelte";
  import { auth, db } from "$lib/firebase/client";
  import { onAuthStateChanged } from "firebase/auth";
  import { goto } from "$app/navigation";
  import TopSide from "$lib/components/TopSide.svelte";
  import LeftSide from "$lib/components/LeftSide.svelte";
  import { fly } from 'svelte/transition'

  let show = false;

  onMount(async () => {
    onAuthStateChanged(auth, (_user) => {
      if (!_user) {
        goto("/login");
      } else {
        show = true;
      }
    });
  });
</script>

{#if show}
<div class="layout" in:fly={{ y: 50, duration: 500, delay: 500 }} out:fly={{ duration: 500 }}>
  <TopSide />
  <div class="wrapper">
      <LeftSide />
      <div class="rightSide">
				<img
				src="https://github.com/stephenlai2021/whatzapp/blob/master/static/pattern.jpg?raw=true"
				alt=""
				/>	
      </div>
		</div>
	</div>
	{/if}