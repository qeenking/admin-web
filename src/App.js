import React from "react";
import { Admin, Resource } from "react-admin";
import { PostList, PostCreate, PostShow } from "./components/Posts";
import {
  CurriculumList,
  CurriculumShow,
  CurriculumCreate,
} from "./components/curriculums";
import { ThemeList, ThemeShow, ThemeCreate } from "./components/themes";
import authProvider from "./components/authProvider";
// import dataProvider from "./components/dataProvider";
import myDataProvider from "./components/myDataProvider";

const App = () => {
  return (
    <Admin authProvider={authProvider} dataProvider={myDataProvider}>
      <Resource
        name="contents"
        list={PostList}
        show={PostShow}
        // edit={PostEdit}
        create={PostCreate}
      />
      <Resource
        name="themes"
        list={ThemeList}
        show={ThemeShow}
        create={ThemeCreate}
      />
      <Resource
        name="curriculums"
        list={CurriculumList}
        show={CurriculumShow}
        create={CurriculumCreate}
      />
    </Admin>
  );
};

export default App;
