<script>
  import Shimmer from "$lib/components/skeleton/Shimmer.svelte";

  let users = [1, 1, 1, 1, 1, 1, 1, 1];
</script>

<ul class="skeleton">
  {#each users as user}
    <div class="block">
      <div class="imgbx">
        <img src="" alt="" class="cover" />
      </div>
      <div class="details">
        <div class="listHead">
          <h4 class="title">Stephen Lai</h4>
          <p class="time">10:56</p>
        </div>
        <div class="message_p">
          <p>How to make Whatsapp clone using html and css</p>
          <b>1</b>
        </div>
      </div>
      <!-- <Shimmer /> -->
    </div>
  {/each}
</ul>

<style>
  .skeleton {
		height: 100vh;
  }

	.skeleton .block {
		display: flex;
    padding: 15px;
    /* background: var(--skeleton-bg-color); */
    position: relative;
		/* border: 1px solid red; */
  }

	.skeleton .block .details {
		width: 100%;
		/* border: 1px solid green; */
	}

	.skeleton .imgbx,
  .skeleton .block .details .listHead .title,
  .skeleton .block .details .listHead .time,
  .skeleton .block .details .message_p p {
    background: #d6d8dc;
		color: transparent;
    /* overflow: hidden; */
  }

  .skeleton .block .details .listHead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }

	.skeleton .block .details .listHead .time {
		height: 18px;
  }  
	
	.skeleton .block .details .listHead .title {
		height: 22px;
    max-width: 200px;
  }
	
	.skeleton .block .details .listHead .message_p p {
    height: 18px;
    /* max-width: 200px; */
		width: 100%;
  }

  .title,
  .message_p {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .imgbx {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
  }

  @media (max-width: 800px) {
		.skeleton .block {
			width: 100%;
		}
	}
</style>
