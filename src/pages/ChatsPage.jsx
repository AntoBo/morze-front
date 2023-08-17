import { Button, Card, Modal, Input, Tabs, Select } from 'antd';

import Container from '../components/Container';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import { fetchGetAllUsers } from '../services/api';

const cardStyle = {
  width: 300,
  marginBottom: 30,
};

const ChatsPage = ({ user, socket }) => {
  const tabItems = [
    {
      key: '1',
      label: `Name`,
      children: (
        <div>
          <Card size="small" title="Name" style={cardStyle}>
            <p>.----.---...----</p>
          </Card>
          <Card size="small" extra="Me" style={cardStyle}>
            <p>.----.---...----...------</p>
          </Card>
          <Card size="small" title="Name" style={cardStyle}>
            <p>----.----...----...----.----...----.----.----...----.----...----.----...----.----...----</p>
          </Card>
        </div>
      ),
    },
  ];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [chats, setChats] = useState([]);
  const [recipientId, setRecepientId] = useState(null);
  const [message, setMessage] = useState(null);

  const sendMessage = async () => {
    socket.emit('private-message', { recipientId, message });
    const chatsNew = chats.map(chat => {
      if (chat.key === recipientId) {
        chat.children.push({ extra: 'Me', message });
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
    console.log('chats :>> ', chats);
  }, [chats]);

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
                      <Card key={i} size="small" title={child.name} extra={child.extra} style={cardStyle}>
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
              value={message}
              onChange={e => setMessage(e.target.value)}
              style={{ width: 215 }}
              placeholder="Type message"
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
            filterOption={(input, option) => (option?.label ?? '').includes(input)}
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
