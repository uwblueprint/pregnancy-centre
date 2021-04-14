import firebase from "./firebase";

export const storage = firebase.storage();

export const getFilesFromFolder = async (folder: string) => {
  const folderRef = storage.ref(folder);
  const images = await folderRef
    .listAll()
    .then(async (result) => {
      return await Promise.all(
        result.items.map((imgRef) => {
          return imgRef
            .getDownloadURL()
            .then(function (url) {
              return url;
            })
            .catch(function (error) {
              return "";
            });
        })
      ).then((val) => {
        return val;
      });
    })
    .catch((err) => {
      return [""];
    });

  return images;
};
