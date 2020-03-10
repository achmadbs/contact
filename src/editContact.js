import React, { useState } from 'react';
import { Modal, Button, Grid, Icon, Form, Input } from 'semantic-ui-react';
import logo from './logo.svg';
import axios from 'axios';

const EditContactModal = ({ firstName, lastName, age, photo, id }) => {
  const [data, setData] = useState({
    firstName: firstName,
    lastName: lastName,
    age: age,
    id: id
  })
  const [imagePreview, setImagePreview] = useState([photo]);
  const [img, setImg] = useState([]);

  const handleValueInput = e => {
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value
    });
  }

  const handlePutContact = async() => {
    const { firstName, lastName, age, id } = data;
    try {
      await axios.put(`https://simple-contact-crud.herokuapp.com/contact/${id}`,{ firstName: firstName, lastName: lastName, age: age, photo: "img" })
      alert('edited');
      window.location.reload();
    } catch (e) {
      alert('error')
    }
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
            <img src={logo} alt="placeholder"/> :
              <img style={{maxWidth: 300}} src={imagePreview} alt="foto"/>
        }
      </>
    );
  }

  const renderHeader = () => {
    return (
      <Modal.Header>
        <p>Edit Contact</p>
      </Modal.Header>
    );
  }

  const editFirstName = () => {
    const { firstName } = data
    return (
      <Form.Field>
        <label>Edit firstName</label>
        <Input 
          placeholder='firstName'
          name="firstName"
          value={firstName}
          onChange={handleValueInput}
        />
      </Form.Field>
    );
  }

  const editLastName = () => {
    const { lastName } = data
    return (
      <Form.Field>
        <label>Edit lastName</label>
        <Input
          placeholder='lastName' 
          name="lastName"
          value={lastName}
          onChange={handleValueInput}
        />
    </Form.Field>
    );
  }

  const editAge = () => {
    const { age } = data
    return (
      <Form.Field>
        <label>Edit Age</label>
        <Input
          placeholder='age'
          name="age"
          value={age}
          onChange={handleValueInput}
        />
      </Form.Field>
    );
  }

  const submitButton = () => <Button onClick={handlePutContact}>Submit</Button> 

  const renderEditContent = () => {
    return (
      <Modal.Content>
        <Modal.Description>
          <Grid>
            <Grid.Column width={9}>
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
            <Grid.Column floated="right" width={7}>
              <Form>
                {editFirstName()}
                {editLastName()}
                {editAge()}
                {submitButton()}
              </Form>
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>
    );
  }

  return (
    <Modal trigger = {
      <Button size="mini" icon>
        <Icon name="pencil" />
      </Button>
    } closeIcon size="small" dimmer='inverted'>
      {renderHeader()}
      {renderEditContent()}
    </Modal>
  );
}

export default EditContactModal;