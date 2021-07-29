import {
  ReferenceInput,
  TextInput,
  List,
  Datagrid,
  TextField,
  SimpleForm,
  SelectInput,
  Create,
  Filter,
  SelectArrayInput,
  ShowButton,
  Show,
  SimpleShowLayout,
  DateField,
  ArrayField,
  Pagination,
} from "react-admin";

export const ThemeList = (props) => (
  <List
    filters={<PostFilter />}
    {...props}
    perPage={30}
    pagination={<Pagination rowsPerPageOptions={[]} />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="title" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const ThemeShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <ArrayField source="contents">
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
          <TextField source="category" />
          <TextField source="type" />
          <TextField source="description" />
        </Datagrid>
      </ArrayField>
      <DateField label="Publication date" source="createdDate" />
    </SimpleShowLayout>
  </Show>
);

export const ThemeCreate = (props) => {
  const optionRenderer = (choice) => `${choice.id} (${choice.title})`;
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="title" />
        <ReferenceInput source="contentIds" reference="contents">
          <SelectArrayInput optionText={optionRenderer} />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

const PostFilter = (props) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <ReferenceInput label="User" source="userId" reference="users" allowEmpty>
      <SelectInput optionText="name" />
    </ReferenceInput>
  </Filter>
);
