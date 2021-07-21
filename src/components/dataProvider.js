import { fetchUtils } from "react-admin";
import { stringify } from "querystring";

const apiUrl = "https://api.dangnagwi.lomy.info";

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const token = JSON.parse(localStorage.getItem("auth"));
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

const httpClient2 = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({});
  }
  const token = JSON.parse(localStorage.getItem("auth"));
  options.headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, options);
};

export default {
  getList: async (resource, params) => {
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;
    const query = {
      // sort: "name.desc",
      size: 10,
      page: 0,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url);
    return {
      data: json.result,
      total: json.count,
    };
  },

  getOne: async (resource, params) => {
    if (resource === "themes" || resource === "curriculums") {
      const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`);
      return {
        data: json,
      };
    } else {
      const { json: json_1 } = await httpClient(
        `${apiUrl}/${resource}/${params.id}`
      );
      return {
        data: {
          id: json_1.id,
          title: json_1.title,
          category: json_1.category,
          type: json_1.type,
          thumbnail: JSON.parse(json_1.metadata).thumbnail,
          files: JSON.parse(json_1.metadata).files,
          createdDate: json_1.createdDate,
        },
      };
    }
  },

  getMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const url = `/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url);
    return { data: json };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    const query = {
      sort: JSON.stringify([field, order]),
      range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      filter: JSON.stringify({
        ...params.filter,
        [params.target]: params.id,
      }),
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const { headers, json } = await httpClient(url);
    return {
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    };
  },

  update: (resource, params) => {
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const { json } = await httpClient(
      `${apiUrl}/${resource}?${stringify(query)}`,
      {
        method: "PUT",
        body: JSON.stringify(params.data),
      }
    );
    return { data: json };
  },

  create: async (resource, params) => {
    if (resource !== "contents") {
      // console.log(params);
      // fallback to the default implementation
      const json = await httpClient(`${apiUrl}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return {
        data: { ...params.data, id: json.body },
      };
    } else {
      // console.log(params);
      const getFormData = (object) => {
        const formData = new FormData();
        Object.getOwnPropertyNames(object).forEach((key) => {
          if (key === "files") {
            let fileData = object[key];
            let i,
              j = 0;
            for (i = 0, j = fileData.length; i < j; i += 1) {
              formData.append(key, fileData[i]);
            }
          } else {
            formData.append(key, object[key]);
          }
        });
        return formData;
      };

      const formedData = getFormData(params.data);
      // for (var pair of formedData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }

      const json_1 = await httpClient2(`${apiUrl}/${resource}`, {
        method: "POST",
        body: formedData,
      });
      return {
        data: { ...params.data, id: json_1.body },
      };
    }
  },

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: async (resource, params) => {
    const query = params.ids;
    const json = await query.map((id) =>
      httpClient(`${apiUrl}/${resource}/${id}`, {
        method: "DELETE",
      })
    );
    return { data: json };
  },
};
