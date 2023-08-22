import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import socketIOClient from 'socket.io-client';

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:5000'
    : window.location.host;

const Chatbox = () => {
  const [socket, setSocket] = useState(null);
  const uiMessagesRef = useRef(null);
  const [userName, setUserName] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState([
    { from: 'System', body: 'Hello there, Please ask your question.' },
  ]);

  useEffect(() => {
    if (uiMessagesRef.current) {
      uiMessagesRef.current.scrollBy({
        top: uiMessagesRef.current.scrollHeight,
        left: 0,
        behavior: 'smooth',
      });
    }
    if (socket) {
      socket.emit('onLogin', { name: userName });
      socket.on('message', (data) => {
        console.log(messages);
        setMessages([...messages, data]);
      });
    }
  }, [messages, isOpen, socket, userName]);

  const supportHandler = () => {
    setIsOpen(true);
    // setUserName("Joe");
    if (!userName) {
      setUserName(prompt('Please enter your name'));
    }
    const sk = socketIOClient(ENDPOINT);
    setSocket(sk);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!messageBody.trim()) {
      alert('Please type message');
    } else {
      setMessages([
        ...messages,
        { body: messageBody, from: userName, to: 'Admin' },
      ]);
      setMessageBody('');
      setTimeout(() => {
        socket.emit('onMessage', {
          body: messageBody,
          from: userName,
          to: 'Admin',
        });
      }, 1000);
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
            <ListGroup ref={uiMessagesRef}>
              {messages.map((msg, index) => (
                <ListGroup.Item key={index}>
                  <strong>{`${msg.from}: `}</strong> {msg.body}
                </ListGroup.Item>
              ))}
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
