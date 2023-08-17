import { Button, Form, Input, Tabs } from "antd";
import Title from "antd/es/typography/Title";
import { fetchLogin, fetchSignup } from "../services/api";
import Container from "../components/Container";

const onLoginFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const onSignipFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
};

const LoginPage = ({ token, setToken, setUser }) => {
    const onLoginFinish = async (data) => {
        try {
            const resp = await fetchLogin(data);
            if (resp.status <= 201) {
                setToken(resp.data?.token);
                setUser(resp.data?.user);
            }
            console.log("resp :>> ", resp);
        } catch (error) {
            console.log("error :>> ", error);
        }
    };

    const onSignupFinish = async (data) => {
        try {
            const resp = await fetchSignup(data);
            if (resp.status <= 201) {
                setToken(resp.data?.token);
                setUser(resp.data?.user);
            }
            console.log("resp :>> ", resp);
        } catch (error) {
            console.log("error :>> ", error);
        }
    };

    const tabItems = [
        {
            key: "1",
            label: `Login`,
            children: (
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onLoginFinish}
                    onFinishFailed={onLoginFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="default" htmlType="submit">
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: "2",
            label: `Signup`,
            children: (
                <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onSignupFinish}
                    onFinishFailed={onSignipFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your name!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your password!",
                            },
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Signup
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <Container>
            <div>
                <Title style={{ marginBottom: "30px", display: "flex", justifyContent: "center" }} level={3}>
                    Welcome to Morze-chat
                </Title>
                <Tabs centered defaultActiveKey="1" items={tabItems} />
            </div>
        </Container>
    );
};

export default LoginPage;
