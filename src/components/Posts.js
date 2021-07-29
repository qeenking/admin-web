import {
  ReferenceInput,
  TextInput,
  List,
  Datagrid,
  TextField,
  SimpleForm,
  SelectInput,
  Edit,
  // EditButton,
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
  Pagination,
  required,
} from "react-admin";

// const orderExporter = (orders) => {
//   const ordersForExport = orders.map((order) => {
//     return {
//       Id: order.id,
//       Title: order.title,
//       Category: order.category,
//       Type: order.type,
//       Description: order.description,
//       Metadata: order.metadata,
//       CreatedDate: order.createdDate,
//       ModifiedDate: order.modifiedDate,
//     };
//   });
//   jsonExport(ordersForExport, {}, (err, csv) => {
//     downloadCSV(csv, "orders");
//   });
// };

export const PostList = (props) => (
  <List
    filters={<PostFilter />}
    {...props}
    perPage={30}
    pagination={<Pagination rowsPerPageOptions={[]} />}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="category" />
      <TextField source="type" />
      {/* <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField> */}
      <TextField source="title" />
      <ShowButton />
      {/* <EditButton /> */}
    </Datagrid>
  </List>
);

export const PostShow = (props) => (
  <Show title={<PostTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="category" />
      <TextField source="type" />
      <TextField source="description" />
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
      <DateField label="Modified date" source="modifiedDate" />
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
        {/* <ImageField source="thumbnail">
          <FunctionField
            label="Image"
            render={(record) => {
              return <img src={record.thumbnail} alt="thumbnail" />;
            }}
          />
        </ImageField> */}
        <FileInput source="files" label="Related files" multiple={true}>
          <FileField source="src" title="title" />
        </FileInput>
        {/* <FilesField source="files" /> */}
      </SimpleForm>
    </Edit>
  );
};

export const PostCreate = (props) => {
  const validateInput = required();
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="title" validate={validateInput} />
        <TextInput source="category" validate={validateInput} />
        <TextInput source="type" validate={validateInput} />
        <TextInput multiline source="description" />
        <ImageInput
          source="metadata"
          label="thumbnail"
          accept="image/*"
          placeholder={<p>Drop your thumbnail here</p>}
          validate={validateInput}>
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

const PostTitle = ({ record }) => {
  return <span>Post {record ? `"${record.title}"` : ""}</span>;
};
