# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte@next

# create a new project in my-app
npm init svelte@next my-app
```

> Note: the `@next` is temporary

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

``` 
const handleFileChange = async (e) => {
  const types = ["image/png", "image/jpg", "image/jpeg"];

  let selectedFile = e.target.files[0];

  if (selectedFile && types.includes(selectedFile.type)) {
    file = selectedFile;
    console.log(file);
    console.log(`${file.name} is selected`);
    $selectedImg = file;
    fileError = null;

    let imgPath =
      loggedinUser.displayName > $selectedUsername
        ? `${loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${loggedinUser.displayName}`;

    let imageRef = ref(
      storage,
      `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
        file.name
      }`
    );

    uploadBytes(imageRef, file).then(() => {
      console.log("image upload completed !");
      getDownloadURL(imageRef).then((_url) => {
        url = _url;
        let msgId =
          loggedinUser.displayName > $selectedUsername
            ? `${loggedinUser.displayName} & ${$selectedUsername}`
            : `${$selectedUsername} & ${loggedinUser.displayName}`;
        let msgRef = collection(db, "messages", msgId, "chat");
        addDoc(msgRef, {
          from: loggedinUser.displayName,
          to: $selectedUsername,
          createdAt: Timestamp.fromDate(new Date()),
          imageURL: url || "",
        }).then(() => {
          console.log("document added successfully 😎");
        });
      });
    });
  } else {
    file = null;
    fileError = "Please select an image file (png or jpg)";
    alert(fileError)
  }
}; 

const handleSubmit = async () => {
  $showEmojiMenu = false;
  messageSent = $message;
  $message = "";

  let imgPath =
    loggedinUser.displayName > $selectedUsername
      ? `${loggedinUser.displayName} & ${$selectedUsername}`
      : `${$selectedUsername} & ${loggedinUser.displayName}`;

  if ($selectedImg) {
    imageRef = ref(
      storage,
      `letschat/messages/images/${imgPath}/${new Date().getTime()} - ${
        $selectedImg.name
      }`
    );
    try {
      await uploadBytes(imageRef, $selectedImg);
      console.log("image upload completed !");
      $selectedImg = null;
    } catch (err) {
      console.log("image uploaded failed");
    }
  }

  if ($pictureFile) {
    imageRef = ref(
      storage,
      `letschat/messages/camera/${imgPath}/${$pictureFile.name}`
    );
    try {
      await uploadBytes(imageRef, $pictureBlob);
      console.log("picture upload completed !");
      $pictureFile = null;
    } catch (err) {
      console.log("picture uploaded failed");
    }
  }

  try {
    const url = await getDownloadURL(imageRef);
    console.log("get downloaded url: ", url);

    let msgId =
      loggedinUser.displayName > $selectedUsername
        ? `${loggedinUser.displayName} & ${$selectedUsername}`
        : `${$selectedUsername} & ${loggedinUser.displayName}`;
    let msgRef = collection(db, "messages", msgId, "chat");
    try {
      await addDoc(msgRef, {
        message: messageSent,
        from: loggedinUser.displayName,
        to: $selectedUsername,
        createdAt: Timestamp.fromDate(new Date()),
        image: url || "",
      });
      messageSent = "";
      console.log("message created successfully 😁");
    } catch (error) {
      console.log("ooh, something went wrong 😥", error);
    }
  } catch (err) {
    console.log(err.message);
  }

  let msgId =
    loggedinUser.displayName > $selectedUsername
      ? `${loggedinUser.displayName} & ${$selectedUsername}`
      : `${$selectedUsername} & ${loggedinUser.displayName}`;
  let msgRef = collection(db, "messages", msgId, "chat");
  try {
    await addDoc(msgRef, {
      message: messageSent,
      from: loggedinUser.displayName,
      to: $selectedUsername,
      createdAt: Timestamp.fromDate(new Date()),
    });
    messageSent = "";
    console.log("message created successfully 😁");
  } catch (error) {
    console.log("ooh, something went wrong 😥", error);
  }
};
```
