<div class="navbar">
  <div class="icon-wrapper">
    <main>
      <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
      <span>chat</span>
    </main>
  </div>
  <div class="icon-wrapper">
    <main>
      <ion-icon name="people-outline"></ion-icon>
      <span>group</span>
    </main>
  </div>
</div>

<style>
  span {
    font-size: 0.8rem;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* border: 1px solid; */
  }

  .icon-wrapper {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid; */
  }

  .navbar {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    display: flex;
    backdrop-filter: blur(20px);
    /* border-top: 1px solid; */
  }
</style>

