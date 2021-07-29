import { fetchUtils } from "react-admin";
import { stringify } from "querystring";

const PROXY = window.location.hostname === "localhost" ? "" : "/proxy";
//API 끌어올때 CORS 오류에 걸리지 않기 위한 PROXY 선언
//앞서 사용한 fetch와 비슷한 기능을 하는 httpClient 사용
const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  //헤더가 없으니 생성해주고
  const token = JSON.parse(localStorage.getItem("auth"));
  //로컬의 auth 값을 token에 저장
  options.headers.set("Authorization", `Bearer ${token}`);
  //헤더에 추가해준다.
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

const getFormData = (object) => {
  let formData = new FormData();
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
// eslint-disable-next-line
export default {
  getList: async (resource, params) => {
    // const { page, perPage } = params.pagination;
    // const { field, order } = params.sort;
    const query = {
      // sort: "name.desc",
      size: 30,
      page: 0,
    };
    const url = `${PROXY}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url);
    //위에서 만들어둔 httpClient를 사용하여, 원하는 요청을 받기 위한 API URL 전송(헤더에 token을 넣어서 사용하기 위함)
    return {
      data: json.result,
      total: json.count,
    };
    //받은 데이터를 어떤 식으로 저장할 것인지 return
  },

  getOne: async (resource, params) => {
    if (resource === "themes" || resource === "curriculums") {
      const { json } = await httpClient(`${PROXY}/${resource}/${params.id}`);
      return {
        data: json,
      };
    } else {
      const { json: json_1 } = await httpClient(
        `${PROXY}/${resource}/${params.id}`
      );
      return {
        data: {
          id: json_1.id,
          title: json_1.title,
          category: json_1.category,
          type: json_1.type,
          description: json_1.description,
          thumbnail: JSON.parse(json_1.metadata).thumbnail,
          files: JSON.parse(json_1.metadata).files,
          createdDate: json_1.createdDate,
          modifiedDate: json_1.modifiedDate,
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
    const url = `${PROXY}/${resource}?${stringify(query)}`;

    const { headers, json } = await httpClient(url);
    return {
      data: json,
      total: parseInt(headers.get("content-range").split("/").pop(), 10),
    };
  },

  update: (resource, params) => {
    httpClient(`${PROXY}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  updateMany: async (resource, params) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    const { json } = await httpClient(
      `${PROXY}/${resource}?${stringify(query)}`,
      {
        method: "PUT",
        body: JSON.stringify(params.data),
      }
    );
    return { data: json };
  },

  create: async (resource, params) => {
    if (resource !== "contents") {
      const json = await httpClient(`${PROXY}/${resource}`, {
        method: "POST",
        body: JSON.stringify(params.data),
      });
      return {
        data: { ...params.data, id: json.body },
      };
    } else {
      const formedData = getFormData(params.data);
      // for (var pair of formedData.entries()) {
      //   console.log(pair[0] + ", " + pair[1]);
      // }

      const json_1 = await httpClient2(`${PROXY}/${resource}`, {
        method: "POST",
        body: formedData,
      });
      return {
        data: { ...params.data, id: json_1.body },
      };
    }
  },

  delete: (resource, params) =>
    httpClient(`${PROXY}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json })),

  deleteMany: async (resource, params) => {
    const query = params.ids;
    const json = await query.map((id) =>
      httpClient(`${PROXY}/${resource}/${id}`, {
        method: "DELETE",
      })
    );
    return { data: json };
  },
};
