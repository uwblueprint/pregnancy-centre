import firebase from "./firebase";

const storage = firebase.storage();

const upload = async (file: string, id: string, dir: string): Promise<string> => {
    const storageRef = storage.ref(dir);
    if (file) {
        await storageRef.child(id).putString(file, "data_url");
        const url = await storageRef.child(id).getDownloadURL();
        return <string>url;
    }
    return "";
};

export default {
    upload
};
