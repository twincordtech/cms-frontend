/* ========================================================================
 * File: PreviewModal.jsx
 * Description: Modal for previewing a component's sample data and field structure.
 * Author: Tech4biz Solutions
 * Copyright: Tech4biz Solutions Private
 * ======================================================================== */

import React, { useState, useEffect } from 'react';
import { Modal, Tabs, Button, Tooltip } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

/**
 * PreviewModal Component
 * Modal for previewing a component's sample data and field structure.
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {function} props.onClose
 * @param {object} props.component
 * @param {function} props.sampleDataGenerator - function to generate sample data
 * @param {function} props.generateSampleDataFromFields - function to generate sample data from fields
 */
const { TabPane } = Tabs;

const PreviewModal = ({ isOpen, onClose, component, sampleDataGenerator, generateSampleDataFromFields }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [previewData, setPreviewData] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (component && component.type) {
      // Get the appropriate sample data generator
      const generator = sampleDataGenerator?.[component.type.toLowerCase()];
      if (generator) {
        // Generate sample data based on component type
        const sampleData = generator();
        setPreviewData(sampleData);
      } else if (generateSampleDataFromFields) {
        // Fallback to field-based generation if no specific generator exists
        const sampleData = generateSampleDataFromFields(component.fields);
        setPreviewData(sampleData);
      } else {
        setPreviewData(null);
      }
    }
  }, [component, sampleDataGenerator, generateSampleDataFromFields]);

  const handleCopy = () => {
    if (!previewData) return;
    navigator.clipboard.writeText(JSON.stringify(previewData, null, 2))
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(() => setCopySuccess(false));
  };

  return (
    <Modal
      title={`${component?.name || 'Component'} Preview`}
      open={isOpen}
      onCancel={onClose}
      width={1200}
      footer={null}
      className="component-preview-modal"
      aria-label="Component Preview Modal"
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Preview" key="1">
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Component Preview Data</h3>
                <Tooltip title={copySuccess ? "Copied!" : "Copy JSON"}>
                  <Button 
                    icon={<CopyOutlined />} 
                    onClick={handleCopy} 
                    type="text" 
                    aria-label="Copy Preview JSON"
                  />
                </Tooltip>
              </div>
              <div className="p-4 bg-gray-50">
                <pre className="bg-white p-4 rounded border border-gray-200 overflow-auto max-h-[300px]">
                  {JSON.stringify(previewData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Fields Structure" key="2">
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Field Definitions</h3>
              </div>
              <div className="p-4 bg-gray-900 rounded-b-lg">
                <pre className="text-gray-100 overflow-auto max-h-[500px]">
                  {JSON.stringify(component?.fields, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default PreviewModal;

/* ========================================================================
 * End of File: PreviewModal.jsx
 * ======================================================================== */ 