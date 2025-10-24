// ===============================
// File: InquiryForm.jsx
// Description: Comprehensive inquiry form for collecting detailed contact, employment, and project information.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import { Form, Input, Button, Select, Checkbox, Radio, message, Card, Typography } from 'antd';
import { createInquiry } from '../../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

/**
 * InquiryForm provides a comprehensive form for collecting detailed inquiry information.
 * Includes contact details, employment information, project details, and marketing preferences.
 */
const InquiryForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);
      const inquiryType = 'general'; // or set based on your logic
      await createInquiry({ ...values, inquiryType });
      message.success('Thank you for your inquiry! We will contact you soon.');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ maxWidth: 700, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div style={{ textAlign: 'left', marginBottom: 24 }}>
        <Title level={4}>Contact information</Title>
      </div>
      <Form
        form={form}
        name="inquiry_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        {/* Contact Information Section */}
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="firstName"
            rules={[{ required: true, message: 'Please enter your first name' }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            name="lastName"
            rules={[{ required: true, message: 'Please enter your last name' }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email' }, { type: 'email', message: 'Please enter a valid email' }]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="telephone"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Input placeholder="Telephone" />
          </Form.Item>
        </Form.Item>

        {/* Employment Information Section */}
        <div style={{ margin: '32px 0 16px 0' }}>
          <Title level={4}>Employment information</Title>
        </div>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="jobRole"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Select placeholder="Job Role" allowClear>
              <Option value="Developer">Developer</Option>
              <Option value="Manager">Manager</Option>
              <Option value="Executive">Executive</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="companyName"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Input placeholder="Company Name" />
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="companyType"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Select placeholder="Company Type" allowClear>
              <Option value="Startup">Startup</Option>
              <Option value="Enterprise">Enterprise</Option>
              <Option value="SMB">SMB</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="industry"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Select placeholder="Industry" allowClear>
              <Option value="Technology">Technology</Option>
              <Option value="Finance">Finance</Option>
              <Option value="Healthcare">Healthcare</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="country"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Select placeholder="Country or Region" allowClear showSearch>
              <Option value="USA">USA</Option>
              <Option value="India">India</Option>
              <Option value="UK">UK</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="state"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Input placeholder="State" />
          </Form.Item>
        </Form.Item>
        <Form.Item name="postalCode">
          <Input placeholder="Postal Code" />
        </Form.Item>

        {/* Project Details Section */}
        <div style={{ margin: '32px 0 16px 0' }}>
          <Title level={4}>Project details</Title>
        </div>
        <Form.Item style={{ marginBottom: 0 }}>
          <Form.Item
            name="useCase"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Select placeholder="Use Case" allowClear>
              <Option value="Cloud Migration">Cloud Migration</Option>
              <Option value="App Development">App Development</Option>
              <Option value="Consulting">Consulting</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="natureOfInquiry"
            style={{ display: 'inline-block', width: 'calc(50% - 8px)', marginLeft: 16 }}
          >
            <Select placeholder="Nature of Inquiry" allowClear>
              <Option value="General">General</Option>
              <Option value="Pricing">Pricing</Option>
              <Option value="Technical">Technical</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
        </Form.Item>
        <Form.Item
          name="projectDescription"
          rules={[{ required: true, message: 'Please tell us about your project' }]}
        >
          <Input.TextArea placeholder="Tell us about your project*" rows={4} />
        </Form.Item>
        <Form.Item name="interests" rules={[{ required: true, message: 'Please select your interest' }]}> 
          <Radio.Group>
            <Radio value="business">Business interests</Radio>
            <Radio value="personal">Personal interests</Radio>
          </Radio.Group>
        </Form.Item>
        {/* Marketing Opt-in Section */}
        <Form.Item name="marketingOptIn" valuePropName="checked">
          <Checkbox>
            Yes, I'd like Cloudtopia Cloud Services to share the latest news about Cloudtopia Cloud services and related offerings with me by email, post or telephone.
          </Checkbox>
        </Form.Item>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
          You may unsubscribe from receiving Cloudtopia Cloud Services news and offers at any time by following the instructions in the communications received. Cloudtopia Cloud Services handles your information as described in the Cloudtopia Cloud Services Privacy Notice.
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default InquiryForm;
// ===============================
// End of File: InquiryForm.jsx
// Description: Comprehensive inquiry form
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 