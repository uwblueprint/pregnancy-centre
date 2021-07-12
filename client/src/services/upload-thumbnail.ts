import firebase from "./firebase";

const storage = firebase.storage();
const storageRef = storage.ref("thumbnail_images");

 const upload = async (file: File | null, id: string):Promise<string> => {
  if (file) {
    await storageRef.child(id).put(file)
    const url = await storageRef.child(id).getDownloadURL();
    return <string>url;
  }
  return ""
};

export default {
  upload,
};
