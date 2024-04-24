'use client';

import React from 'react';
import { signIn } from 'next-auth/react';
import { Button, Checkbox, Form, type FormProps, Input, message } from 'antd';
// import { useRouter } from 'next/navigation';
import { useRouter } from 'next/router';

type FieldType = {
  username?: string;
  password?: string;
};

const App: React.FC = () => {
  const router = useRouter();
  // const {path} = router
  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    const callbackUrl = router.query.callbackUrl || '/';
    console.log('router', router.query.callbackUrl);
    try {
      const user = await signIn('credentials', {
        username: values.username,
        password: values.password,
        redirect: false, //
        // callbackUrl: `${window.location.origin}${callbackUrl}`,
      });
      console.log('user', user);
      if (user && !user.error) {
        message.success('登录成功');
        router.push(Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl);
        // router.refresh();
      } else {
        message.error('登录失败');
      }
    } catch (error) {
      message.error('登录失败');
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="w-full h-full flex items-center justify-center ">
      <div></div>
      <Form
        className=""
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType> label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType> label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password />
        </Form.Item>

        {/* <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;
