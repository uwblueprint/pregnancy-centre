import firebase from "./firebase";

const storage = firebase.storage();
const storageRef = storage.ref("request_images");

const upload = (file: File | null, id: string) => {
  if (file) {
    storageRef
      .child(id)
      .put(file)
      .then((snapshot) => {
        console.log("uploaded file!");
        storageRef.child(id).getDownloadURL()
        .then((url) => {
            console.log(url)
            return url
        })
      });
  }
};

export default {
  upload,
};
