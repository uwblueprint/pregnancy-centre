import firebase from './firebase';

const storage = firebase.storage();
const storageRef = storage.ref('/request_images');


const upload = (file: File, id: string) => {
  storageRef
    .child(id)
    .put(file)
    .then((snapshot) => {
      console.log('uploaded file!');
    });
};

export default {
  upload,
};