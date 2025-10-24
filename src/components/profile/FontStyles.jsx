/**
 * FontStyles.jsx
 * 
 * Typography customization component for theme settings.
 * Handles font family, size, weight, style, and text decoration preferences.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Typography, Select, Slider, Radio, Space, Card, Row, Col, Button, message } from 'antd';
import { 
  FaFont, 
  FaTextHeight, 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaMobileAlt, 
  FaDesktop, 
  FaTabletAlt,
  FaEye,
  FaUndo,
  FaSave
} from 'react-icons/fa';

const { Text, Title } = Typography;

/**
 * Font options with categories for better organization
 * @constant {Array} fontOptions
 */
const fontOptions = [
  { 
    label: 'Sans-serif',
    options: [
      { value: 'Roboto', label: 'Roboto' },
      { value: 'Open Sans', label: 'Open Sans' },
      { value: 'Lato', label: 'Lato' },
      { value: 'Montserrat', label: 'Montserrat' },
      { value: 'Poppins', label: 'Poppins' },
      { value: 'Inter', label: 'Inter' },
      { value: 'Source Sans Pro', label: 'Source Sans Pro' },
      { value: 'Nunito', label: 'Nunito' },
      { value: 'Ubuntu', label: 'Ubuntu' },
    ]
  },
  {
    label: 'Serif',
    options: [
      { value: 'Playfair Display', label: 'Playfair Display' },
      { value: 'Merriweather', label: 'Merriweather' },
      { value: 'Georgia', label: 'Georgia' },
      { value: 'Times New Roman', label: 'Times New Roman' },
    ]
  },
  {
    label: 'Monospace',
    options: [
      { value: 'Roboto Mono', label: 'Roboto Mono' },
      { value: 'Inconsolata', label: 'Inconsolata' },
      { value: 'Source Code Pro', label: 'Source Code Pro' },
      { value: 'JetBrains Mono', label: 'JetBrains Mono' },
    ]
  }
];

/**
 * Font weight options with descriptive labels
 * @constant {Array} fontWeightOptions
 */
const fontWeightOptions = [
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi Bold' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Extra Bold' }
];

/**
 * FontStyles Component
 * 
 * Provides comprehensive typography customization options including font family,
 * size, weight, style, and text decoration with real-time preview functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onFontChange - Callback for font family changes
 * @param {Function} props.onSizeChange - Callback for font size changes
 * @param {Function} props.onWeightChange - Callback for font weight changes
 * @param {Function} props.onStyleChange - Callback for font style changes
 * @param {Function} props.onDecorationChange - Callback for text decoration changes
 * @param {boolean} props.isDarkMode - Dark mode state
 * @returns {JSX.Element} Font styles component
 */
const FontStyles = ({ 
  onFontChange, 
  onSizeChange, 
  onWeightChange, 
  onStyleChange, 
  onDecorationChange,
  isDarkMode = false 
}) => {
  // Font settings state
  const [selectedFont, setSelectedFont] = useState('Roboto');
  const [fontSize, setFontSize] = useState(100);
  const [fontWeight, setFontWeight] = useState(400);
  const [fontStyle, setFontStyle] = useState('normal');
  const [textDecoration, setTextDecoration] = useState('none');

  // UI state management
  const [hasChanges, setHasChanges] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Default font settings for reset functionality
  const defaultFontSettings = {
    family: 'Roboto',
    size: 100,
    weight: 400,
    style: 'normal',
    decoration: 'none'
  };

  /**
   * Loads saved font preferences from localStorage
   * @function loadSavedFontSettings
   */
  const loadSavedFontSettings = useCallback(() => {
    try {
      const savedSettings = localStorage.getItem('fontSettings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSelectedFont(parsed.family || defaultFontSettings.family);
        setFontSize(parsed.size || defaultFontSettings.size);
        setFontWeight(parsed.weight || defaultFontSettings.weight);
        setFontStyle(parsed.style || defaultFontSettings.style);
        setTextDecoration(parsed.decoration || defaultFontSettings.decoration);
      }
    } catch (error) {
      console.error('Error loading font settings:', error);
      message.error('Failed to load font preferences');
    }
  }, []);

  /**
   * Saves current font settings to localStorage
   * @function saveFontSettings
   */
  const saveFontSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const currentSettings = {
        family: selectedFont,
        size: fontSize,
        weight: fontWeight,
        style: fontStyle,
        decoration: textDecoration,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('fontSettings', JSON.stringify(currentSettings));
      
      // Simulate API call for saving settings
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHasChanges(false);
      message.success('Font preferences saved successfully');
    } catch (error) {
      console.error('Error saving font settings:', error);
      message.error('Failed to save font preferences');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFont, fontSize, fontWeight, fontStyle, textDecoration]);

  /**
   * Resets font settings to default values
   * @function resetFontSettings
   */
  const resetFontSettings = useCallback(() => {
    setSelectedFont(defaultFontSettings.family);
    setFontSize(defaultFontSettings.size);
    setFontWeight(defaultFontSettings.weight);
    setFontStyle(defaultFontSettings.style);
    setTextDecoration(defaultFontSettings.decoration);
    setHasChanges(true);
    message.info('Font settings reset to default values');
  }, []);

  /**
   * Handles font family changes
   * @function handleFontChange
   * @param {string} value - Selected font family
   */
  const handleFontChange = useCallback((value) => {
    setSelectedFont(value);
    setHasChanges(true);
    onFontChange?.(value);
  }, [onFontChange]);

  /**
   * Handles font size changes
   * @function handleFontSizeChange
   * @param {number} value - Font size percentage
   */
  const handleFontSizeChange = useCallback((value) => {
    setFontSize(value);
    setHasChanges(true);
    onSizeChange?.(value);
  }, [onSizeChange]);

  /**
   * Handles font weight changes
   * @function handleFontWeightChange
   * @param {number} value - Font weight value
   */
  const handleFontWeightChange = useCallback((value) => {
    setFontWeight(value);
    setHasChanges(true);
    onWeightChange?.(value);
  }, [onWeightChange]);

  /**
   * Handles font style changes
   * @function handleFontStyleChange
   * @param {string} value - Font style value
   */
  const handleFontStyleChange = useCallback((value) => {
    setFontStyle(value);
    setHasChanges(true);
    onStyleChange?.(value);
  }, [onStyleChange]);

  /**
   * Handles text decoration changes
   * @function handleTextDecorationChange
   * @param {string} value - Text decoration value
   */
  const handleTextDecorationChange = useCallback((value) => {
    setTextDecoration(value);
    setHasChanges(true);
    onDecorationChange?.(value);
  }, [onDecorationChange]);

  // Load saved settings on component mount
  useEffect(() => {
    loadSavedFontSettings();
  }, [loadSavedFontSettings]);

  return (
    <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'
    }`}>
      {/* Section Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className={`mb-0 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Typography Settings
        </Title>
        
        <div className="flex items-center space-x-3">
          {/* Preview Toggle */}
          <Button
            onClick={() => setShowPreview(!showPreview)}
            icon={<FaEye />}
            type={showPreview ? 'primary' : 'default'}
            size="small"
          >
            Preview
          </Button>
          
          {/* Reset Button */}
          <Button
            onClick={resetFontSettings}
            icon={<FaUndo />}
            disabled={isLoading}
            size="small"
          >
            Reset
          </Button>
          
          {/* Save Button */}
          <Button
            onClick={saveFontSettings}
            loading={isLoading}
            disabled={!hasChanges}
            icon={<FaSave />}
            type="primary"
            size="small"
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction="vertical" size="large" className="w-full">
            {/* Font Family Selection */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaFont className="text-blue-500" />
                  <span className="font-medium">Font Family</span>
                </div>
              }
            >
              <Select
                showSearch
                placeholder="Select a font"
                optionFilterProp="children"
                onChange={handleFontChange}
                value={selectedFont}
                style={{ width: '100%' }}
                options={fontOptions}
                optionLabelProp="label"
                disabled={isLoading}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              />
            </Card>

            {/* Font Size Control */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaTextHeight className="text-blue-500" />
                  <span className="font-medium">Font Size</span>
                </div>
              }
            >
              <div className="space-y-4">
                <Slider
                  min={50}
                  max={200}
                  step={5}
                  value={fontSize}
                  onChange={handleFontSizeChange}
                  tooltip={{
                    formatter: (value) => `${value}%`
                  }}
                  disabled={isLoading}
                />
                <div className="text-center">
                  <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                    Current size: {fontSize}%
                  </Text>
                </div>
              </div>
            </Card>

            {/* Font Weight Control */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaBold className="text-blue-500" />
                  <span className="font-medium">Font Weight</span>
                </div>
              }
            >
              <Radio.Group 
                onChange={(e) => handleFontWeightChange(e.target.value)} 
                value={fontWeight}
                disabled={isLoading}
                className="w-full"
              >
                <div className="grid grid-cols-2 gap-2">
                  {fontWeightOptions.map(option => (
                    <Radio.Button 
                      key={option.value} 
                      value={option.value}
                      className="text-center"
                      style={{ fontWeight: option.value }}
                    >
                      {option.label}
                    </Radio.Button>
                  ))}
                </div>
              </Radio.Group>
            </Card>

            {/* Font Style Control */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaItalic className="text-blue-500" />
                  <span className="font-medium">Font Style</span>
                </div>
              }
            >
              <Radio.Group 
                onChange={(e) => handleFontStyleChange(e.target.value)} 
                value={fontStyle}
                disabled={isLoading}
              >
                <Radio.Button value="normal">Normal</Radio.Button>
                <Radio.Button value="italic" style={{ fontStyle: 'italic' }}>Italic</Radio.Button>
              </Radio.Group>
            </Card>

            {/* Text Decoration Control */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaUnderline className="text-blue-500" />
                  <span className="font-medium">Text Decoration</span>
                </div>
              }
            >
              <Radio.Group 
                onChange={(e) => handleTextDecorationChange(e.target.value)} 
                value={textDecoration}
                disabled={isLoading}
              >
                <Radio.Button value="none">None</Radio.Button>
                <Radio.Button value="underline" style={{ textDecoration: 'underline' }}>
                  Underline
                </Radio.Button>
                <Radio.Button value="line-through" style={{ textDecoration: 'line-through' }}>
                  Strikethrough
                </Radio.Button>
              </Radio.Group>
            </Card>
          </Space>
        </Col>
      </Row>

      {/* Typography Preview */}
      {showPreview && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Typography Preview</h3>
          <div 
            className="p-6 rounded-lg border bg-white"
            style={{
              fontFamily: selectedFont,
              fontSize: `${fontSize}%`,
              fontWeight: fontWeight,
              fontStyle: fontStyle,
              textDecoration: textDecoration,
            }}
          >
            <h4 className="mb-3">Sample Heading</h4>
            <p className="mb-3">
              This is a sample paragraph demonstrating how your selected typography settings 
              will appear in the application. The text includes various elements to showcase 
              the font family, size, weight, style, and decoration options.
            </p>
            <p className="mb-3">
              You can see how the text looks with different settings applied. This preview 
              helps you make informed decisions about your typography preferences.
            </p>
            <div className="text-sm text-gray-600">
              <p>Font Family: {selectedFont}</p>
              <p>Font Size: {fontSize}%</p>
              <p>Font Weight: {fontWeight}</p>
              <p>Font Style: {fontStyle}</p>
              <p>Text Decoration: {textDecoration}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FontStyles;

/**
 * @copyright Tech4biz Solutions Private
 */ 