// Fill in the missing code
import React, {useState, Fragment, useEffect} from 'react';
import { Form, Container } from 'react-bootstrap';
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';


const New = function ({user}) {

  const [tourTypes, setTourTypes] = useState([]);

  const [inputs, setInputs] = useState({
    title: '',
    tourType: '',
    groupSize: 0,
    date: ''
  });

  useEffect(() => {
    (async () => {
      await getTourTypes();
    })();
  }, []);

  const getTourTypes = async function(){
    const tourTypeResp = await Axios.get('/api/tours/tourTypes');
    
    console.log(tourTypeResp);
    if(tourTypeResp.status === 200) {
      setTourTypes(tourTypeResp.data);
    }
  };
  
  const [redirect,setRedirect] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    const resp = await Axios.post('/api/tours', inputs); 
    try{
      if(resp.status === 200) {
        toast('You have created a new tour!', {
          type: toast.TYPE.SUCCESS
        });
        setRedirect(true);
      }else{
          toast('That failed to work...', {
            type: toast.TYPE.ERROR
          });
      }
    }catch(error){
      toast('That didnt work... sorry!', {
        type: toast.TYPE.ERROR
      });
    }
  };
  const handleInputChange = async event => {
      event.persist();
      const {name, value} = event.target;
      setInputs(inputs => ({
          ...inputs,
          [name]: value
        }))
  };


  
  if (redirect) return(<Redirect to="/tours"/>);

  return (
    <Container className="my-5">
      <header>
        <h1>New Tour</h1>
      </header>

      <hr/>

      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Title:</Form.Label>
            <Form.Control
              name="title"
              onChange={handleInputChange}
              value={inputs.title}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Tour Type:</Form.Label>
            <Form.Control
              as="select"
              name="tourType"
              onChange={handleInputChange}
              defaultValue={inputs.tourType}
            >
              {tourTypes.map((type, i) => (
                <Fragment>
                  <option key={i} value={type}>{type}</option>
                </Fragment>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Group Size:</Form.Label>
            <Form.Control
              type="number"
              name="groupSize"
              step="1"
              min="1"
              max="10"
              onChange={handleInputChange}
              value={inputs.groupSize}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Date:</Form.Label>
            <Form.Control
              type="date"
              name="date"
              onChange={handleInputChange}
              value={inputs.date}
            />
          </Form.Group>

          <Form.Group>
            <button type="submit" className="btn btn-primary">Create</button>
          </Form.Group>
        </Form>
      </div>
    </Container>
  );
};

export default New;