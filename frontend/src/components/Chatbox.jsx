import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');

  const supportHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Please type message');
    }
  };

  return (
    <div className="chatbox">
      {!isOpen ? (
        <Button className="primay" onClick={supportHandler}>
          Chat with us
        </Button>
      ) : (
        <Card>
          <Card.Body>
            <Row>
              <Col>
                <strong>Support</strong>
              </Col>
              <Col className="text-end">
                <Button
                  className="btn-sm"
                  variant="secondary"
                  onClick={closeHandler}
                >
                  x
                </Button>
              </Col>
            </Row>
            <hr />
            <ListGroup>
              <ListGroup.Item>no messages</ListGroup.Item>
            </ListGroup>
            {/* frm */}
            <form onSubmit={handleSubmit}>
              <InputGroup className="col-6">
                <FormControl
                  type="text"
                  value={messageBody}
                  placeholder="type message"
                  onChange={(e) => setMessageBody(e.target.value)}
                />
                <Button type="submit" variant="primary">
                  Send
                </Button>
              </InputGroup>
            </form>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Chatbox;
