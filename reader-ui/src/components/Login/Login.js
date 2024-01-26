import { Button, Card, Form, Input, Toast } from "antd-mobile";
import "./Login.css"
import { EyeInvisibleOutline, EyeOutline } from "antd-mobile-icons";
import { useContext, useState } from "react";
import { login } from "../utils/backend";
import { AppContext } from "../utils/AppProvider";
import { useNavigate } from "react-router-dom";
export default function Login() {

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const {onLogin} = useContext(AppContext)
  const navigate = useNavigate()


  const onClickLogin = () => {

    login(username, password).then((res) => {
      const uid = res['uid']
      console.log("login uid", uid)

      if (uid) {
        onLogin(uid)
        Toast.show({
          content: 'you are logged in!',
          position: 'bottom',
        })
        navigate("/")

      }else{
        Toast.show({
          content: 'login failed!',
          position: 'bottom',
        })
      }

    })


  }

  return (

    <div className="login">
      <div className="centered-div">

        <Card>
          <Form layout='vertical'>
            <Form.Item label='Username' >
              <Input placeholder='username' clearable
                value={username}
                onChange={(e) => { setUsername(e) }} />
            </Form.Item>
            <Form.Item label='Password' >
              <Input placeholder='password' clearable type='password'
                value={password}
                onChange={(e) => { setPassword(e) }} />
            </Form.Item>
            <Form.Item>
              <Button onClick={() => { onClickLogin() }}>Login</Button>
            </Form.Item>
          </Form>

        </Card>

      </div>
    </div>

  );
}
