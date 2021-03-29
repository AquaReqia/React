import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import React, { useState,useEffect } from 'react'
import { useCookies } from 'react-cookie';

const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 2, span: 16 },
  };

  
const LoginPage = () => {
    const [cookies, setCookie] = useCookies(['keyCookie']);

    const onFinish = (values) => {
        setCookie('apiKeyCookie', values.apiKey, { path: '/' });
        setCookie('apiSecretKeyCookie', values.secretKey, { path: '/' });
      };
    
      const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
      };

  return (
    <Row>
        <Col span={3}></Col>
        <Col span={18}>
            <Form {...layout} name="basic" initialValues={{ remember: true }} onFinish={onFinish} onFinishFailed={onFinishFailed} >
                <Form.Item label="API KEY" name="apiKey" rules={[{ required: true, message: 'Please input your API KEY!' }]} >
                    <Input defaultValue={cookies.apiKeyCookie}/>
                </Form.Item>

                <Form.Item label="SECRET KEY" name="secretKey" rules={[{ required: true, message: 'Please input your SECRET KEY!' }]} >
                    <Input defaultValue={cookies.apiSecretKeyCookie}/>
                </Form.Item>

                <Form.Item {...tailLayout}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Col>
        <Col span={3}></Col>
    </Row>
  );
}

export default LoginPage;