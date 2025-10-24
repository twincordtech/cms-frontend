/**
 * CustomizationSection.jsx
 * 
 * Theme customization component for user profile settings.
 * Handles color schemes, layout preferences, and theme mode selection.
 * 
 * @author Tech4biz Solutions
 * @copyright Tech4biz Solutions Private
 * @version 1.0.0
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Typography, ColorPicker, Card, Space, Slider, Radio, Row, Col, message } from 'antd';
import { FaPalette, FaBorderAll, FaLayerGroup, FaSave, FaUndo, FaEye } from 'react-icons/fa';
import FontStyles from './FontStyles';

const { Title, Text } = Typography;

/**
 * CustomizationSection Component
 * 
 * Provides comprehensive theme customization options including colors, layout,
 * typography, and theme mode. Includes real-time preview and save functionality.
 * 
 * @component
 * @returns {JSX.Element} Customization section component
 */
const CustomizationSection = () => {
  // Theme state management
  const [primaryColor, setPrimaryColor] = useState('#1890ff');
  const [secondaryColor, setSecondaryColor] = useState('#52c41a');
  const [borderRadius, setBorderRadius] = useState(8);
  const [spacing, setSpacing] = useState(16);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Font settings state
  const [fontSettings, setFontSettings] = useState({
    family: 'Roboto',
    size: 100,
    weight: 400,
    style: 'normal',
    decoration: 'none'
  });

  // UI state management
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Default theme values for reset functionality
  const defaultTheme = {
    primaryColor: '#1890ff',
    secondaryColor: '#52c41a',
    borderRadius: 8,
    spacing: 16,
    isDarkMode: false,
    fontSettings: {
      family: 'Roboto',
      size: 100,
      weight: 400,
      style: 'normal',
      decoration: 'none'
    }
  };

  /**
   * Loads saved theme preferences from localStorage
   * @function loadSavedTheme
   */
  const loadSavedTheme = useCallback(() => {
    try {
      const savedTheme = localStorage.getItem('userTheme');
      if (savedTheme) {
        const parsedTheme = JSON.parse(savedTheme);
        setPrimaryColor(parsedTheme.primaryColor || defaultTheme.primaryColor);
        setSecondaryColor(parsedTheme.secondaryColor || defaultTheme.secondaryColor);
        setBorderRadius(parsedTheme.borderRadius || defaultTheme.borderRadius);
        setSpacing(parsedTheme.spacing || defaultTheme.spacing);
        setIsDarkMode(parsedTheme.isDarkMode || defaultTheme.isDarkMode);
        setFontSettings(parsedTheme.fontSettings || defaultTheme.fontSettings);
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
      message.error('Failed to load saved theme preferences');
    }
  }, []);

  /**
   * Saves current theme preferences to localStorage
   * @function saveTheme
   */
  const saveTheme = useCallback(async () => {
    try {
      setIsSaving(true);
      
      const currentTheme = {
        primaryColor,
        secondaryColor,
        borderRadius,
        spacing,
        isDarkMode,
        fontSettings,
        lastUpdated: new Date().toISOString()
      };

      localStorage.setItem('userTheme', JSON.stringify(currentTheme));
      
      // Simulate API call for theme saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasChanges(false);
      message.success('Theme preferences saved successfully');
    } catch (error) {
      console.error('Error saving theme:', error);
      message.error('Failed to save theme preferences');
    } finally {
      setIsSaving(false);
    }
  }, [primaryColor, secondaryColor, borderRadius, spacing, isDarkMode, fontSettings]);

  /**
   * Resets theme to default values
   * @function resetTheme
   */
  const resetTheme = useCallback(() => {
    setPrimaryColor(defaultTheme.primaryColor);
    setSecondaryColor(defaultTheme.secondaryColor);
    setBorderRadius(defaultTheme.borderRadius);
    setSpacing(defaultTheme.spacing);
    setIsDarkMode(defaultTheme.isDarkMode);
    setFontSettings(defaultTheme.fontSettings);
    setHasChanges(true);
    message.info('Theme reset to default values');
  }, []);

  /**
   * Applies theme changes to the document
   * @function applyTheme
   */
  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    
    // Apply CSS custom properties
    root.style.setProperty('--primary-color', primaryColor);
    root.style.setProperty('--secondary-color', secondaryColor);
    root.style.setProperty('--border-radius', `${borderRadius}px`);
    root.style.setProperty('--spacing', `${spacing}px`);
    
    // Apply font settings
    root.style.setProperty('--font-family', fontSettings.family);
    root.style.setProperty('--font-size', `${fontSettings.size}%`);
    root.style.setProperty('--font-weight', fontSettings.weight);
    root.style.setProperty('--font-style', fontSettings.style);
    root.style.setProperty('--text-decoration', fontSettings.decoration);
    
    // Apply dark mode
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [primaryColor, secondaryColor, borderRadius, spacing, isDarkMode, fontSettings]);

  // Load saved theme on component mount
  useEffect(() => {
    loadSavedTheme();
  }, [loadSavedTheme]);

  // Apply theme changes when values change
  useEffect(() => {
    applyTheme();
    setHasChanges(true);
  }, [applyTheme]);

  // Font change handlers
  const handleFontChange = useCallback((value) => {
    setFontSettings(prev => ({ ...prev, family: value }));
  }, []);

  const handleFontSizeChange = useCallback((value) => {
    setFontSettings(prev => ({ ...prev, size: value }));
  }, []);

  const handleFontWeightChange = useCallback((value) => {
    setFontSettings(prev => ({ ...prev, weight: value }));
  }, []);

  const handleFontStyleChange = useCallback((value) => {
    setFontSettings(prev => ({ ...prev, style: value }));
  }, []);

  const handleTextDecorationChange = useCallback((value) => {
    setFontSettings(prev => ({ ...prev, decoration: value }));
  }, []);

  // Color change handlers
  const handlePrimaryColorChange = useCallback((color) => {
    setPrimaryColor(color.toHexString());
  }, []);

  const handleSecondaryColorChange = useCallback((color) => {
    setSecondaryColor(color.toHexString());
  }, []);

  // Layout change handlers
  const handleBorderRadiusChange = useCallback((value) => {
    setBorderRadius(value);
  }, []);

  const handleSpacingChange = useCallback((value) => {
    setSpacing(value);
  }, []);

  const handleDarkModeChange = useCallback((checked) => {
    setIsDarkMode(checked);
  }, []);

  return (
    <div className={`rounded-lg shadow-md p-6 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900 text-white' : 'bg-white'
    }`}>
      {/* Section Header with Actions */}
      <div className="flex items-center justify-between mb-6">
        <Title level={2} className={`mb-0 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
          Theme Customization
        </Title>
        
        <div className="flex items-center space-x-3">
          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center px-3 py-2 rounded-md transition-colors ${
              showPreview 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Toggle theme preview"
          >
            <FaEye className="mr-2" />
            Preview
          </button>
          
          {/* Reset Button */}
          <button
            onClick={resetTheme}
            disabled={isSaving}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            aria-label="Reset theme to default"
          >
            <FaUndo className="mr-2" />
            Reset
          </button>
          
          {/* Save Button */}
          <button
            onClick={saveTheme}
            disabled={!hasChanges || isSaving}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Save theme preferences"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" 
                     role="status" aria-label="Saving">
                </div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" />
                Save
              </>
            )}
          </button>
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Space direction="vertical" size="large" className="w-full">
            {/* Theme Mode */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaLayerGroup className="text-blue-500" />
                  <span className="font-medium">Theme Mode</span>
                </div>
              }
            >
              <div className="flex items-center justify-between">
                <Text strong className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                  Dark Mode
                </Text>
                <Radio.Group 
                  value={isDarkMode} 
                  onChange={(e) => handleDarkModeChange(e.target.value)}
                  className="theme-mode-group"
                >
                  <Radio.Button value={false}>Light</Radio.Button>
                  <Radio.Button value={true}>Dark</Radio.Button>
                </Radio.Group>
              </div>
            </Card>

            {/* Color Settings */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaPalette className="text-blue-500" />
                  <span className="font-medium">Colors</span>
                </div>
              }
            >
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text strong className={`block mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Primary Color
                  </Text>
                  <ColorPicker
                    value={primaryColor}
                    onChange={handlePrimaryColorChange}
                    presets={[
                      {
                        label: 'Recommended',
                        colors: [
                          '#1890ff',
                          '#52c41a',
                          '#722ed1',
                          '#eb2f96',
                          '#f5222d',
                          '#fa8c16',
                          '#fadb14',
                        ],
                      },
                    ]}
                  />
                </div>

                <div>
                  <Text strong className={`block mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Secondary Color
                  </Text>
                  <ColorPicker
                    value={secondaryColor}
                    onChange={handleSecondaryColorChange}
                    presets={[
                      {
                        label: 'Recommended',
                        colors: [
                          '#1890ff',
                          '#52c41a',
                          '#722ed1',
                          '#eb2f96',
                          '#f5222d',
                          '#fa8c16',
                          '#fadb14',
                        ],
                      },
                    ]}
                  />
                </div>
              </Space>
            </Card>

            {/* Layout Settings */}
            <Card 
              className={`border-0 shadow-sm backdrop-blur-sm ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
              }`}
              title={
                <div className="flex items-center gap-2">
                  <FaBorderAll className="text-blue-500" />
                  <span className="font-medium">Layout</span>
                </div>
              }
            >
              <Space direction="vertical" size="large" className="w-full">
                <div>
                  <Text strong className={`block mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Border Radius
                  </Text>
                  <Slider
                    min={0}
                    max={24}
                    value={borderRadius}
                    onChange={handleBorderRadiusChange}
                    tooltip={{
                      formatter: (value) => `${value}px`
                    }}
                    className="border-radius-slider"
                  />
                </div>

                <div>
                  <Text strong className={`block mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Spacing
                  </Text>
                  <Slider
                    min={8}
                    max={32}
                    value={spacing}
                    onChange={handleSpacingChange}
                    tooltip={{
                      formatter: (value) => `${value}px`
                    }}
                    className="spacing-slider"
                  />
                </div>
              </Space>
            </Card>

            {/* Typography Settings */}
            <FontStyles
              onFontChange={handleFontChange}
              onSizeChange={handleFontSizeChange}
              onWeightChange={handleFontWeightChange}
              onStyleChange={handleFontStyleChange}
              onDecorationChange={handleTextDecorationChange}
              isDarkMode={isDarkMode}
            />
          </Space>
        </Col>
      </Row>

      {/* Theme Preview */}
      {showPreview && (
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Theme Preview</h3>
          <div 
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              color: isDarkMode ? '#f9fafb' : '#1f2937',
              borderRadius: `${borderRadius}px`,
              fontFamily: fontSettings.family,
              fontSize: `${fontSettings.size}%`,
              fontWeight: fontSettings.weight,
              fontStyle: fontSettings.style,
              textDecoration: fontSettings.decoration,
            }}
          >
            <div className="space-y-3">
              <h4 style={{ color: primaryColor }}>Primary Color Text</h4>
              <p>This is a sample text with the current theme settings applied.</p>
              <button 
                className="px-4 py-2 rounded-md text-white"
                style={{ 
                  backgroundColor: primaryColor,
                  borderRadius: `${borderRadius}px`
                }}
              >
                Primary Button
              </button>
              <button 
                className="px-4 py-2 rounded-md text-white ml-2"
                style={{ 
                  backgroundColor: secondaryColor,
                  borderRadius: `${borderRadius}px`
                }}
              >
                Secondary Button
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationSection;

/**
 * @copyright Tech4biz Solutions Private
 */ 