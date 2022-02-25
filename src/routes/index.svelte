<svelte:head>
  <title>Welcome</title>
</svelte:head>

<main>
  <div>
    <img src="/whatsapp-logo.jpg" alt="" />
    <h1>與朋友保持連線</h1>
    <p>Whatsapp 會連線到您的手機來同步訊息</p>
  </div>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    height: 100%;
    background: var(--intro-grey);
    border-bottom: 6px solid var(--intro-border-color);
  }

  main img {
    width: 250px;
    height: 250px;
    opacity: 1;
  }

  main h1 {
    margin-top: 18px;
    color: var(--intro-title-color);
    font-weight: 100;
  }

  main p {
    margin-top: 8px;
    color: var(--intro-subtitle-color);
  }

  @media (max-width: 800px) {
    main {
      display: none;
    }
  }
</style>
