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
  ShowButton,
  Show,
  SimpleShowLayout,
  DateField,
  ArrayField,
  SelectArrayInput,
} from "react-admin";

export const CurriculumList = (props) => (
  <List filters={<PostFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="category" />
      <TextField source="title" />
      <TextField source="description" />
      <ShowButton />
    </Datagrid>
  </List>
);

export const CurriculumShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="category" />
      <ArrayField source="themes">
        <Datagrid>
          <TextField source="id" />
          <TextField source="title" />
        </Datagrid>
      </ArrayField>
      <DateField label="Publication date" source="createdDate" />
    </SimpleShowLayout>
  </Show>
);

export const CurriculumCreate = (props) => {
  const optionRenderer = (choice) => `${choice.id} (${choice.title})`;
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="category" />
        <TextInput multiline source="title" />
        <TextInput multiline source="description" />
        <ReferenceInput source="themeIds" reference="themes">
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
