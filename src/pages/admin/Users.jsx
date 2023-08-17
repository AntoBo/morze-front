import { Button, Table } from "antd";
import Container from "../../components/Container";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { fetchBanUser, fetchGetAllUsers, fetchRemoveUser } from "../../services/api";

const Users = () => {
    const [users, setUsers] = useState([]);

    const banUser = async (id) => {
        try {
            const resp = await fetchBanUser(id);
            if (resp.status === 200) {
                const isBanned = users.find((u) => (u.id = id))?.isBanned;
                toast.success(`User is ${isBanned ? "unbanned" : "banned"}`);
                getUsers();
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    };
    const removeUser = async (id) => {
        try {
            const resp = await fetchRemoveUser(id);
            if (resp.status === 200) {
                toast.error(`User is removed`);
                getUsers();
            }
        } catch (error) {
            console.log("error :>> ", error);
        }
    };

    const getUsers = async () => {
        try {
            const resp = await fetchGetAllUsers();
            setUsers(resp.data?.map((user) => ({ ...user, key: user.id })));
        } catch (error) {
            console.log("error :>> ", error);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Action",
            key: "action",
            render: (_, user) => (
                <>
                    <Button
                        onClick={() => {
                            banUser(user.id);
                        }}
                    >
                        {user.isBanned ? "Unban" : "Ban"}
                    </Button>{" "}
                    <Button
                        onClick={() => {
                            removeUser(user.id);
                            toast.error("User Removed");
                        }}
                        type="primary"
                    >
                        Remove
                    </Button>
                </>
            ),
        },
    ];

    useEffect(() => {
        console.log("users :>> ", users);
    }, [users]);

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <Container>
            <div>
                <Title style={{ marginBottom: "30px", display: "flex", justifyContent: "center" }} level={3}>
                    Users
                </Title>
                <Table dataSource={users} columns={columns} pagination={false} />
            </div>
        </Container>
    );
};

export default Users;
