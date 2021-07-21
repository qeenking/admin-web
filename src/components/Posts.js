import {
  ReferenceInput,
  TextInput,
  List,
  Datagrid,
  TextField,
  SimpleForm,
  SelectInput,
  Edit,
  EditButton,
  Create,
  Filter,
  ImageField,
  ImageInput,
  FileInput,
  FileField,
  Show,
  SimpleShowLayout,
  DateField,
  ShowButton,
  FunctionField,
} from "react-admin";

export const PostList = (props) => (
  <List filters={<PostFilter />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="category" />
      <TextField source="type" />
      {/* <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField> */}
      <TextField source="title" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="category" />
      <TextField source="type" />
      <ImageField source="thumbnail">
        <FunctionField
          label="Image"
          render={(record) => {
            return <img src={record.thumbnail} alt="thumbnail" />;
          }}
        />
      </ImageField>
      <FilesField source="files" />
      <DateField label="Publication date" source="createdDate" />
    </SimpleShowLayout>
  </Show>
);

export const PostEdit = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput disabled source="id" />
        <TextInput source="title" />
        <TextInput source="category" />
        <TextInput source="type" />
        <TextInput multiline source="description" />
        <ImageInput
          source="metadata"
          label="thumbnail"
          accept="image/*"
          placeholder={<p>Drop your thumbnail here</p>}>
          <ImageField source="src" />
        </ImageInput>
        <ImageField source="thumbnail">
          <FunctionField
            label="Image"
            render={(record) => {
              return <img src={record.thumbnail} alt="thumbnail" />;
            }}
          />
        </ImageField>
        <FileInput source="files" label="Related files" multiple={true}>
          <FileField source="src" title="title" />
        </FileInput>
        {/* <FilesField source="files" /> */}
      </SimpleForm>
    </Edit>
  );
};

export const PostCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="title" />
        <TextInput source="category" />
        <TextInput source="type" />
        <TextInput multiline source="description" />
        <ImageInput
          source="metadata"
          label="thumbnail"
          accept="image/*"
          placeholder={<p>Drop your thumbnail here</p>}>
          <ImageField source="src" />
        </ImageInput>
        <FileInput source="files" label="Related files" multiple={true}>
          <FileField source="src" title="title" />
        </FileInput>
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

const FilesField = ({ record }) => (
  <ul>
    {record.files &&
      record.files.map((item) => (
        <li key={item}>
          <a href={item}>{item}</a>
        </li>
      ))}
  </ul>
);
FilesField.defaultProps = {
  addLabel: true,
};
