import firebase from "./firebase";

const storage = firebase.storage();
const storageRef = storage.ref("request_images");

 const upload = async (file: File | null, id: string) => {
  if (file) {
    await storageRef.child(id).put(file)
    const url = await storageRef.child(id).getDownloadURL();
    return url;
  }
};

export default {
  upload,
};
