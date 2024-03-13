import React, { useState, useRef } from 'react';
import type { CascaderProps, FormInstance } from 'antd';
import { AutoComplete, Button, Cascader, Checkbox, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { Stop } from '@/components/icons';
import { PauseOutlined } from '@ant-design/icons';

const { Option } = Select;

interface DataNodeType {
  value: string;
  label: string;
  children?: DataNodeType[];
}

const models: CascaderProps<DataNodeType>['options'] = [
  {
    value: 'zhipuai',
    label: '智谱',
    children: [
      {
        value: 'glm-4',
        label: 'glm-4',
      },
      {
        value: 'glm-3-turbo',
        label: 'glm-3-turbo',
      },
    ],
  },
  {
    value: 'qianfan',
    label: '百度',
    children: [
      {
        value: 'ERNIE-Bot-4',
        label: 'ERNIE-Bot-4',
      },
      {
        value: 'ERNIE-Bot-8k',
        label: 'ERNIE-Bot-8k',
      },
      {
        value: 'ERNIE-Bot',
        label: 'ERNIE-Bot',
      },
    ],
  },
  {
    value: 'dashscope',
    label: '阿里',
    children: [
      {
        value: 'qwen-turbo',
        label: 'qwen-turbo',
      },
      {
        value: 'qwen-plus',
        label: 'qwen-plus',
      },
      {
        value: 'qwen-max',
        label: 'qwen-max',
      },
    ],
  },
];

const formItemLayout = {
  // labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 6 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 14 },
  //   },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

interface ConfigFormProps {
  // form:FormInstance;
  onFinish: (values: any) => void;
  loading: boolean;
  stop: () => void;
}

export default function Index(props: ConfigFormProps) {
  const [customDirectory, setCustomDirectory] = useState<boolean>(false);
  const { onFinish, loading, stop } = props;
  const [form] = Form.useForm();

  // const onFinish = (values: any) => {
  //   console.log("Received values of form: ", values);
  // };

  return (
    <div className=" w-full h-full p-8">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        // labelAlign="left"
        // style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="model"
          label="模型选择"
          rules={[
            {
              type: 'array',
              required: true,
              message: '请选择模型！',
            },
          ]}
        >
          <Cascader options={models} />
        </Form.Item>

        <Form.Item
          name="api_key"
          label="api_key"
          tooltip="请输入对应模型api_key"
          rules={[
            {
              required: true,
              message: '请输入对应模型api_key！',
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="document_type"
          label="文档类型"
          rules={[
            {
              required: true,
              message: '请选择文档类型！',
              whitespace: true,
            },
          ]}
        >
          <Select>
            <Select.Option value="technical_documentation">技术文档</Select.Option>
            <Select.Option value="construction_plan">建设方案</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="demand" label="具体需求" rules={[{ required: true, message: '请填写文档具体需求' }]} tooltip="撰写文档的具体需求">
          <Input.TextArea showCount maxLength={1000} style={{ height: 300 }} />
        </Form.Item>
        <Form.Item
          label="单小节字数限制"
          tooltip="单个小节的字数，不能精确到具体数值，篇幅长短控制"
          name="wordNumber"
          rules={[{ required: true, message: '请填写单小节字数限制' }]}
          initialValue={200}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <div>
          <Checkbox
            checked={customDirectory}
            onChange={() => {
              setCustomDirectory(!customDirectory);
            }}
          >
            是否需要自定义文档目录
          </Checkbox>
        </div>
        {customDirectory && (
          <Form.Item name="directory" label="文档目录结构" rules={[{ required: true, message: '请输入文档目录' }]} tooltip="文档的目录结构">
            <Input.TextArea showCount maxLength={1000} />
          </Form.Item>
        )}

        {/* <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: "Please select gender!" }]}
        >
          <Select placeholder="select your gender">
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item> */}

        {/* <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error("Should accept agreement")),
            },
          ]}
          {...tailFormItemLayout}
        >
          <Checkbox>
            I have read the <a href="">agreement</a>
          </Checkbox>
        </Form.Item> */}
        <Form.Item {...tailFormItemLayout}>
          <Button htmlType="submit" loading={loading} disabled={loading}>
            开始生成文档
          </Button>
          {loading && (
            <Button
              onClick={() => {
                stop();
              }}
              icon={<PauseOutlined />}
            >
              stop
            </Button>
          )}
        </Form.Item>
      </Form>
      <div className=" h-3"></div>
    </div>
  );
}
