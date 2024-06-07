import { useContext, useState } from "react";
import { AppContext } from "../utils/AppProvider";
import { App, Button, Col, Input, Row, Space, Typography } from "antd";
import { ArrowRightOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { loginBackend } from "../utils/backend";


export default function Login() {
    const { message } = App.useApp()
    const { onLoginLocal } = useContext(AppContext);
    const [username, setUsername] = useState("demouser");
    const [password, setPassword] = useState("demouser");


    const onLoginButton = () => {
        loginBackend(username, password).then(res => {
            console.log(res)
            if (res._id) {
                onLoginLocal( res.is_admin,res._id.$oid)
                message.success("Login successful")
            } else {
                message.error("Login failed, check username and password")
            }
        })
    }

    return (
        <Row justify="center" align="middle" style={{ height: "100dvh" }}>
            <Col xs={22} md={12} lg={8} xxl={6}>

                <Space direction="vertical" style={{ width: "100%" }}>
                    <Typography.Title level={2}>Reader</Typography.Title>
                    <Input
                        placeholder="Username"
                        size="large"
                        prefix={<UserOutlined />}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        size="large"
                        prefix={<LockOutlined />}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button
                        size="large"
                        block
                        icon={<ArrowRightOutlined />}
                        // block
                        onClick={() => {
                            // onClickLogin();
                            onLoginButton()
                        }}
                        type="primary"
                    >
                        Login
                    </Button>
                </Space>

            </Col>
        </Row>
    );
}