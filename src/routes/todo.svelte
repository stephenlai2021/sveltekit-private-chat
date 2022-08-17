<script>
  import {
    todos,
    isTodoReady,
    isAddTodoDone,
    getTodos,
    addTodo,
    deleteTodo,
    toggleTodo,
  } from "$lib/store/todoStore";
  import supabase from "$lib/supabase/client";
  import { onMount } from 'svelte'

  let todo;

  getTodos();

  $: if ($isAddTodoDone) todo = "";
</script>

<div class="main">
  <div class="inputBox">
    <input type="text" bind:value={todo} placeholder="Todo item..." />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="ionicon icon-add"
      viewBox="0 0 512 512"
      width="24"
      height="24"
      fill="currentColor"
      on:click={() => addTodo(todo)}
    >
      <path
        fill="none"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
        d="M256 112v288M400 256H112"
      />
    </svg>
  </div>

  {#if !$isTodoReady}
    <div class="posts">
      {#each $todos as todo}
        <div class="post">
          <h3
            class="title"
            class:done={todo.done}
            on:click={() => toggleTodo(todo.done, todo.id)}
          >
            {todo.todo}
          </h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="ionicon icon-trashcan"
            viewBox="0 0 512 512"
            width="20"
            height="20"
            fill="currentColor"
            on:click={() => deleteTodo(todo.id)}
          >
            <path
              d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="32"
              d="M80 112h352"
            />
            <path
              d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="32"
            />
          </svg>
        </div>
      {/each}
    </div>
  {/if}

  {#if $isTodoReady}
    <div class="loading">
      <img
        class="loading-animation"
        src="https://c.tenor.com/On7kvXhzml4AAAAi/loading-gif.gif"
        alt=""
      />
    </div>
  {/if}
</div>

<style>
  .title {    
    cursor: pointer;
  }

  .done {
    text-decoration: line-through;
  }

  .loading-animation {
    width: 50px;
    height: 50px;
  }

  .loading {
    /* text-align: center; */
    height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ::placeholder {
    font-size: large;
  }

  .icon-add {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
  }

  .inputBox {
    position: relative;
  }

  input {
    width: 100%;
    height: 50px;
    padding-left: 10px;
    font-size: large;
  }

  .posts {
    border: 1px solid;
  }

  .main {
    padding: 20px;
  }

  .post {
    margin: 10px;
    display: flex;
    justify-content: space-between;
  }
</style>
