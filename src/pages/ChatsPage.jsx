import { Button, Card, Modal, Input, Tabs, Select } from 'antd';

import Container from '../components/Container';
import Title from 'antd/es/typography/Title';
import { useEffect, useRef, useState } from 'react';
import { fetchGetAllUsers } from '../services/api';
import { nanoid } from 'nanoid';
import io from 'socket.io-client';

const cardStyle = {
  width: 300,
  marginBottom: 30,
};

const socket = io.connect(process.env.REACT_APP_BACKEND_URL);

const ChatsPage = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chats, setChats] = useState([]);
  const [recipientId, setRecepientId] = useState(null);
  const [outMessage, setOutMessage] = useState(null);
  const [inMsgObj, setInMsgObj] = useState(null);

  const handleInput = e => {
    const key = e.nativeEvent.data;
    if (['-', '.', null].includes(key)) {
      setOutMessage(e.target.value);
    }
  };
  const sendMessage = async () => {
    if (!outMessage) {
      return;
    }

    socket.emit('private-message', { recipientId, message: outMessage });

    const chatsNew = chats.map(chat => {
      if (chat.key === recipientId) {
        chat.children.push({ extra: 'Me', message: outMessage, key: nanoid() });
      }
      return chat;
    });
    setChats(chatsNew);
  };

  const getQueriedUsers = async _query => {
    try {
      const resp = await fetchGetAllUsers(_query);
      setOptions(
        resp.data
          .filter(f => f.id !== user?.id && !chats.some(chat => chat.key === f.id))
          .map(opt => ({ ...opt, value: opt.id, label: opt.name }))
      );
    } catch (error) {}
  };

  useEffect(() => {
    socket.emit('authenticate', user);
    socket.on('private-message', ({ sender, message }) => {
      setInMsgObj({ sender, message });
    });
  }, []);

  useEffect(() => {
    if (inMsgObj) {
      const { sender, message } = inMsgObj;
      if (!recipientId) {
        setRecepientId(sender.id);
      }

      if (chats.some(chat => chat.key === sender.id)) {
        const chatsWithNewMsg = chats.map(chat => {
          if (chat.key === sender.id) {
            chat.children.push({ title: sender.name, message, key: nanoid() });
          }
          return chat;
        });
        setChats(chatsWithNewMsg);
      } else {
        const newChat = {
          key: sender.id,
          label: sender.name,
          children: [{ title: sender.name, message, key: nanoid() }],
        };
        setChats(c => [...c, newChat]);
      }
    }
  }, [inMsgObj]);

  useEffect(() => {
    if (query) {
      getQueriedUsers(query);
    }
  }, [query]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    if (selected && !chats.some(chat => chat.key === selected.key)) {
      const newChat = {
        key: selected.value,
        label: selected.label,
        children: [],
      };
      setChats([...chats, newChat]);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <Container>
      <div>
        <div
          style={{
            marginLeft: 100,
            width: 300,
            display: 'inline-flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <Title level={3}>Chats</Title>
          <Button onClick={showModal} style={{ marginLeft: 20, marginBottom: 30 }} type="primary" htmlType="button">
            New chat
          </Button>
        </div>
        <Tabs
          onTabClick={id => {
            setRecepientId(id);
          }}
          tabPosition={'left'}
          items={
            chats.length
              ? chats.map(chat => ({
                  ...chat,
                  children: chat.children.length ? (
                    chat.children.map((child, i) => (
                      <Card key={i} size="small" title={child.title} extra={child.extra} style={cardStyle}>
                        <p>{child.message}</p>
                      </Card>
                    ))
                  ) : (
                    <p>no messages yet</p>
                  ),
                }))
              : []
          }
        />
        {chats.length ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
            <Input
              onPressEnter={sendMessage}
              value={outMessage}
              onChange={handleInput}
              style={{ width: 215 }}
              placeholder="Type '-' or '.' only"
            />
            <Button onClick={sendMessage} style={{ marginLeft: 20 }} type="default" htmlType="button">
              Send
            </Button>
          </div>
        ) : (
          ''
        )}

        <Modal width={250} centered title="Start new chat" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p style={{ marginBottom: 30 }}>Enter name to start chatting</p>
          <Select
            labelInValue
            onChange={value => {
              setSelected(value);
              if (!recipientId) {
                setRecepientId(value.key);
              }
            }}
            onSearch={search => {
              setQuery(search);
            }}
            notFoundContent={<p style={{ margin: 5 }}>No users found</p>}
            showSearch
            style={{ width: 200, marginBottom: 30 }}
            placeholder="Search to Select"
            optionFilterProp="children"
            filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}
          />
        </Modal>
      </div>
    </Container>
  );
};

export default ChatsPage;
