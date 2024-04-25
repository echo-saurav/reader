import { Layout, Typography } from "antd";
import { useEffect } from "react";
import { getTest } from "../utils/backend";


export default function Home(){
    useEffect(()=>{
        getTest().then(c=>{
            console.log(c)
        })
    })
    return(
        <Layout>
            <Typography.Title>Welcome</Typography.Title>
        </Layout>
    )
}