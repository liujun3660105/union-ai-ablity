'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button, Checkbox, Form, type FormProps, Input, message } from 'antd';
import { register, RegisterPayloadProps } from '@/client/api';

// type FieldType = {
//   username: string;
//   password: string;
// };

const onFinish: FormProps<RegisterPayloadProps>['onFinish'] = async (values) => {
  try {
    // const result = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(values),
    //   headers: new Headers({
    //     'Content-Type': 'application/json',
    //     Accept: 'application/json',
    //   }),
    // });
    const result = await register({ ...values });
    console.log('register-result', result);
    message.success('注册成功');
  } catch (error) {
    message.error('注册失败');
  }
};

const onFinishFailed: FormProps<RegisterPayloadProps>['onFinishFailed'] = (errorInfo) => {
  console.log('Failed:', errorInfo);
};

const App: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center ">
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<RegisterPayloadProps> label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input />
      </Form.Item>

      <Form.Item<RegisterPayloadProps> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
        <Input.Password />
      </Form.Item>

      {/* <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
        <Checkbox>Remember me</Checkbox>
      </Form.Item> */}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          注册
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default App;
