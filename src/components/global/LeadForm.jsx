// ===============================
// File: LeadForm.jsx
// Description: Lead capture form for collecting contact information and messages from potential customers.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, BankOutlined, MessageOutlined } from '@ant-design/icons';
import { createLead } from '../../services/api';

const { Title, Text } = Typography;

/**
 * LeadForm provides a simple, user-friendly form for capturing lead information.
 * Includes contact details, company information, and message fields with validation.
 */
const LeadForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onFinish = async (values) => {
    try {
      setLoading(true);
      await createLead(values);
      message.success('Thank you for your interest! We will contact you soon.');
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      style={{ 
        maxWidth: 500, 
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <Title level={3}>Get in Touch</Title>
        <Text type="secondary">Fill out the form below and we'll get back to you soon.</Text>
      </div>

      <Form
        form={form}
        name="lead_form"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        {/* Name field with required validation */}
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Your Name" 
          />
        </Form.Item>

        {/* Email field with email validation */}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please enter your email' },
            { type: 'email', message: 'Please enter a valid email' }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Your Email" 
          />
        </Form.Item>

        {/* Phone field with pattern validation */}
        <Form.Item
          name="phone"
          rules={[
            { pattern: /^[0-9+\-() ]+$/, message: 'Please enter a valid phone number' }
          ]}
        >
          <Input 
            prefix={<PhoneOutlined />} 
            placeholder="Phone Number (Optional)" 
          />
        </Form.Item>

        {/* Company field (optional) */}
        <Form.Item
          name="company"
        >
          <Input 
            prefix={<BankOutlined />} 
            placeholder="Company Name (Optional)" 
          />
        </Form.Item>

        {/* Message field with required validation */}
        <Form.Item
          name="message"
          rules={[{ required: true, message: 'Please enter your message' }]}
        >
          <Input.TextArea 
            prefix={<MessageOutlined />} 
            placeholder="Your Message" 
            rows={4}
          />
        </Form.Item>

        {/* Submit button */}
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LeadForm;
// ===============================
// End of File: LeadForm.jsx
// Description: Lead capture form
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 