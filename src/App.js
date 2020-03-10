import React, { useEffect, useState } from 'react';
import { Table, Segment, Button, Icon, Form, Input, Header, Container, Grid } from 'semantic-ui-react';
import logo from './logo.svg';
import axios from 'axios';
import EditContact from './editContact';

const App = () => {
  const [contact, setContact] = useState([]);
  const [addContact, setAddContact] = useState({
    firstName: '',
    lastName: '',
    age: ''
  });
  const [imagePreview, setImagePreview] = useState([]);
  const [img, setImg] = useState([]);

  useEffect(() => {
    fetchData()
  },[]);

  const fetchData = async() => {
    try {
      const contact = await axios.get('https://simple-contact-crud.herokuapp.com/contact');
      const rawContact = contact?.data || [];
      setContact(rawContact);
    } catch (e) {
      alert('error')
    }
  }

  const handlePostContact = async() => {
    const { firstName, lastName, age } = addContact;
    const data = new FormData();
    data.append('images', img);
    try {
      await axios.post('https://simple-contact-crud.herokuapp.com/contact', { firstName: firstName, lastName: lastName, age: age, photo: "img" });
      alert('added')
    } catch (e) {
      alert('error')
    }
  }

  const handleRemoveButton = id => async() => {
    try {
      await axios.delete(`https://simple-contact-crud.herokuapp.com/contact/${id}`);
      alert('deleted')
      fetchData();
    } catch (e) {
      alert('error')
    }
  }

  const handleValueInput = e => {
    const { value, name } = e.target
    setAddContact({
      ...addContact,
      [name]: value
    })
  }

  const imageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onload = () => {
      setImg(file);
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const renderImage = () => {
    const placeholder = imagePreview.length <= 0
    return (
      <>
        {
          placeholder?
            <img src={logo} alt="foto"/> :
              <img style={{maxWidth: 250}} src={imagePreview} alt="foto"/>
        }
      </>
    )
  }

  const submitButton = () => <Button onClick={handlePostContact}>Submit</Button>

  const tableHeader = () => {
    return (
      <Table.Header fullWidth>
        <Table.Row>
          <Table.HeaderCell>Photo</Table.HeaderCell>
          <Table.HeaderCell>firstName</Table.HeaderCell>
          <Table.HeaderCell>lastName</Table.HeaderCell>
          <Table.HeaderCell>Age</Table.HeaderCell>
          <Table.HeaderCell widths={2}>Action</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    );
  }

  const dataTable = () => {
    const dataContact = contact?.data || [];
    return (
      <>
        <Table.Body>
          {
            dataContact.map(data => {
              const { firstName, lastName, age, photo, id } = data;
              return (
                <Table.Row key={id}>
                  <Table.Cell>
                    <img style={{maxHeight: 90}} src={photo} alt="foto"/>
                  </Table.Cell>
                  <Table.Cell>
                    {firstName}
                  </Table.Cell>
                  <Table.Cell>
                    {lastName}
                  </Table.Cell>
                  <Table.Cell>
                    {age}
                  </Table.Cell>
                  <Table.Cell textAlign='center'>
                    <EditContact
                      firstName={firstName}
                      lastName={lastName}
                      age={age}
                      photo={photo}
                      id={id}
                    />
                    <Button 
                      color="red"
                      size="mini"
                      icon
                      onClick={handleRemoveButton(id)}
                    >
                      <Icon name="delete" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              )
            })
          }
        </Table.Body>
      </>
    );
  }

  const addFirstName = () => {
    const { firstName } = addContact
    return (
      <Form.Field required>
        <label>Add Name</label>
        <Input 
          placeholder="firstName"
          name="firstName"
          value={firstName}
          onChange={handleValueInput}
        />
      </Form.Field>
    );
  }

  const addLastName = () => {
    const { lastName } = addContact
    return (
      <Form.Field required>
        <label>Add Name</label>
        <Input 
          placeholder="lastName"
          name="lastName"
          value={lastName}
          onChange={handleValueInput}
        />
      </Form.Field>
    );
  }

  const addAge = () => {
    const { age } = addContact
    return (
      <Form.Field required>
        <label>Add Name</label>
        <Input 
          placeholder="age"
          name="age"
          value={age}
          onChange={handleValueInput}
        />
      </Form.Field>
    );
  }

  const renderAddMenu = () => {
    return (
      <Container>
        <Form>
          <Grid>
            <Grid.Column width={6}>
              {renderImage()}
            <Grid.Row>
              <Grid.Column width={9}>
                <Input 
                  type="file"
                  accept=".jpg, .jpeg, .png, .gif"
                  onChange={imageChange.bind(this)}
                />
              </Grid.Column>
            </Grid.Row>
            </Grid.Column>
            <Grid.Column width={6}>
              {addFirstName()}
              {addLastName()}
              {addAge()}
              {submitButton()}
            </Grid.Column>
          </Grid>
        </Form>
      </Container>
    );
  }

  return (
    <>
      <Segment>
        <Header>Contact List</Header>
        <Table celled>
          {tableHeader()}
          {dataTable()}
        </Table>
      </Segment>
      <Segment>
        <Header>Add Contact</Header>
        {renderAddMenu()}
      </Segment>
    </>
  );
}

export default App;
