import { Button, Card, Modal, Input, Tabs, Select } from "antd";

import Container from "../components/Container";
import Title from "antd/es/typography/Title";
import { useState } from "react";

const cardStyle = {
    width: 300,
    marginBottom: 30,
};

const ChatsPage = () => {
    const tabItems = [
        {
            key: "1",
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

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <Container>
            <div>
                <div style={{ marginLeft: 100, width: 300, display: "inline-flex", alignItems: "baseline", justifyContent: "space-between" }}>
                    <Title level={3}>Chats</Title>
                    <Button onClick={showModal} style={{ marginLeft: 20, marginBottom: 30 }} type="primary" htmlType="button">
                        New chat
                    </Button>
                </div>
                <Tabs tabPosition={"left"} items={tabItems} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}>
                    <Input style={{ width: 215 }} placeholder="Type message" />
                    <Button style={{ marginLeft: 20 }} type="default" htmlType="button">
                        Send
                    </Button>
                </div>

                <Modal width={250} centered title="Start new chat" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p style={{ marginBottom: 30 }}>Enter name to start chatting</p>
                    <Select
                        notFoundContent={<p style={{ margin: 5 }}>Looks like nobody is online</p>}
                        showSearch
                        style={{ width: 200, marginBottom: 30 }}
                        placeholder="Search to Select"
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? "").includes(input)}
                        filterSort={(optionA, optionB) => (optionA?.label ?? "").toLowerCase().localeCompare((optionB?.label ?? "").toLowerCase())}
                        options={[
                            {
                                value: "1",
                                label: "Not Identified",
                            },
                            {
                                value: "2",
                                label: "Closed",
                            },
                            {
                                value: "3",
                                label: "Communicated",
                            },
                            {
                                value: "4",
                                label: "Identified",
                            },
                            {
                                value: "5",
                                label: "Resolved",
                            },
                            {
                                value: "6",
                                label: "Cancelled",
                            },
                        ]}
                    />
                </Modal>
            </div>
        </Container>
    );
};

export default ChatsPage;
