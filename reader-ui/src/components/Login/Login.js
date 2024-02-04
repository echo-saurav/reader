import { useContext, useState } from "react";
import { login } from "../utils/backend";
import { AppContext } from "../utils/AppProvider";
import { useNavigate } from "react-router-dom";
import { App, Button, Card, Col, Input, Row, Space } from "antd";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Title } from "../../App";
export default function Login() {
  const [username, setUsername] = useState("demouser");
  const [password, setPassword] = useState("demouser");
  const { onLogin } = useContext(AppContext);
  const { message } = App.useApp()
  const navigate = useNavigate();

  const onClickLogin = () => {
    login(username, password).then((res) => {
      console.log("res", res);

      if (res._id) {
        const uid = res._id.$oid;
        const is_admin = res.is_admin;

        onLogin(uid, is_admin);
        
        message.success("you are logged in!")
        navigate("/");
        return;
      }
      message.error("login failed!")
    });
  };

  return (
    <Row justify="center" align="middle" style={{ height: "100dvh" }}>
      <Col xs={23} md={12} lg={8} xxl={6}>
        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Title level={2}>Login</Title>
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
              onClick={() => {
                onClickLogin();
              }}
              type="primary"
            >
              Login
            </Button>
          </Space>
        </Card>
      </Col>
    </Row>
  );
}
