import firebase from "./firebase";

const storage = firebase.storage();
const storageRef = storage.ref(process.env.REACT_APP_FIREBASE_REQUESTGROUP_PHOTOS_ENDPOINT);

const upload = async (file: string, id: string): Promise<string> => {
    if (file) {
        await storageRef.child(id).putString(file, 'data_url');
        const url = await storageRef.child(id).getDownloadURL();
        return <string>url;
    }
    return "";
};

export default {
    upload
};
