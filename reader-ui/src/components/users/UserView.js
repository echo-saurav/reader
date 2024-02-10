import { useContext, useEffect, useState } from "react";
import { deleteUserBackend, getUsersFromBackend, onCreateUserToBackend } from "../utils/backend";
import { Paragraph, Title } from "../../App";
import { App, Button, Drawer, Input, Space, Switch, Table } from "antd";
import { DeleteOutlined, EditOutlined, LockOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { AppContext } from "../utils/AppProvider";


export default function UserView() {
    const [users, setUsers] = useState([])
    const [visible, setVisibility] = useState(false)
    const { modal, message } = App.useApp()
    const { isMobile, isAdmin } = useContext(AppContext)
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [adminSwitch, setAdminSwitch] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = () => {
        getUsersFromBackend().then(res => {
            setUsers([])
            console.log(res)
            if (res && res.length > 0) {
                const tmp = []
                for (let i = 0; i < res.length; i++) {
                    const r = res[i]
                    tmp.push({
                        key: i,
                        is_admin: r.is_admin ? true : false,
                        username: r.username,
                        id: r._id.$oid
                    })
                }
                setUsers(tmp)

            }
        })
    }

    const col = [
        {
            title: "Username",
            dataIndex: "username",
        },
        {
            title: "Admin",
            dataIndex: "is_admin",
            render: (is_admin) => is_admin ? <Paragraph strong >Admin</Paragraph> : <></>
        },
        {
            title: "Action",
            dataIndex: "id",
            render: (id) => (
                isAdmin &&
                <Space size="middle">
                    <Button onClick={() => {
                        onDeleteUser(id)
                    }} danger icon={<DeleteOutlined />}>Delete</Button>
                </Space>
            )

        }
    ]

    const onAddNewUserPopup = () => {
        setUsername("")
        setPassword("")
        setVisibility(true)
    }

    const onCreateUser = () => {
        onCreateUserToBackend(username, password, adminSwitch).then(res => {
            console.log("create user", res)
            if(res['res']){
                setUsername("")
                setPassword("")
                setVisibility(false)
                fetchUser()
                message.success("user create successful")
            }else{
                message.error("user create failed")
            }
        })
    }


    const onDeleteUser = (user_id) => {

        modal.confirm({
            title: "Delete user",
            content: "Are you sure you want to delete this user?",
            onOk: () => {
                message.success("Delete user")
                deleteUserBackend(user_id,adminSwitch).then(res => {
                    console.log(user_id)
                    console.log("delete",res)
                    fetchUser()
                })
            }
        })

    }

    return (
        <>
            <Button onClick={() => { onAddNewUserPopup() }}
                icon={<PlusOutlined />}
                style={{ marginBottom: "10px" }}
                type="primary">
                Add new user
            </Button>

            <Table columns={col} dataSource={users} />
            <Drawer
                // title="Add User"
                open={visible}
                placement={isMobile ? "bottom" : 'right'}
                onClose={() => {
                    setVisibility(false)
                }}>
                <Space direction="vertical" style={{ width: "100%" }}>
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
                    <Space justify="center" align="middle">
                        <Paragraph strong>Make admin user</Paragraph>
                        <Switch checked={adminSwitch} onChange={(v) => { setAdminSwitch(v) }} />
                    </Space>
                    <Button
                        size="large"
                        block
                        onClick={() => {
                            onCreateUser()
                        }}
                        type="primary"
                    >
                        Create user
                    </Button>
                </Space>
            </Drawer>
        </>
    )
}