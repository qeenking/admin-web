import dataProvider from "./dataProvider";

const myDataProvider = {
  ...dataProvider,
  update: (resource, params) => {
    if (resource !== "contents" || !params.data.metadata.rawFile) {
      // fallback to the default implementation
      return dataProvider.update(resource, params);
    }
    /**
     * For posts update only, convert uploaded image in base 64 and attach it to
     * the `picture` sent property, with `src` and `title` attributes.
     */

    // Freshly dropped pictures are File objects and must be converted to base64 strings
    const newPictures = params.data.metadata.rawFile;
    const newFiles = params.data.files.filter((p) => p.rawFile instanceof File);
    let transFiles = [];
    newFiles.map((f) => (transFiles = transFiles.concat(f.rawFile)));
    // const formerPictures = params.data.filter(
    //   (p) => !(p.rawFile instanceof File)
    // );

    return new Promise(() => {
      convertFileToBase64(newPictures).then((transformedNewPictures) =>
        dataProvider.update(resource, {
          ...params,
          data: {
            title: params.data.title,
            type: params.data.type,
            category: params.data.category,
            description: params.data.description,
            metadata: JSON.stringify({
              thumbnail: newPictures,
              files: transFiles,
            }),
          },
        })
      );
    });
  },
  create: (resource, params) => {
    if (resource !== "contents" || !params.data.metadata.rawFile) {
      // fallback to the default implementation
      return dataProvider.create(resource, params);
    } else {
      const newPictures = params.data.metadata.rawFile;
      const newFiles = params.data.files.filter(
        (p) => p.rawFile instanceof File
      );
      let transFiles = [];
      newFiles.map((f) => (transFiles = transFiles.concat(f.rawFile)));
      // console.log(transFiles);

      return new Promise(() => {
        convertFileToBase64(newPictures).then((transFilesz) =>
          dataProvider.create(resource, {
            ...params,
            data: {
              title: params.data.title,
              type: params.data.type,
              category: params.data.category,
              description: params.data.description,
              thumbnail: newPictures,
              files: transFiles,
            },
          })
        );
      });
    }
  },
};

const convertFileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

// const getFormData = (object) => {
//   const formData = new FormData();
//   Object.getOwnPropertyNames(object).forEach((key) =>
//     formData.append(key, object[key])
//   );
//   return formData;
// };

export default myDataProvider;
