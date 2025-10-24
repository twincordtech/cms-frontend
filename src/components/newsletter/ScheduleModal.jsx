// ===============================
// File: ScheduleModal.jsx
// Description: Modal for scheduling newsletters (frequency, time, custom dates, etc.).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { TimePicker, Tooltip } from 'antd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { newsletterApi } from '../../services/api';
import ConfirmationModal from '../ui/ConfirmationModal';

const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'One Time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' }
];

const WEEKDAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
];

/**
 * Modal for scheduling a newsletter (frequency, time, custom dates, etc.)
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onClose - Function to close the modal
 * @param {Object} props.newsletter - Newsletter object to schedule
 * @param {function} props.onSchedule - Callback after scheduling
 */
const ScheduleModal = ({ isOpen, onClose, newsletter, onSchedule }) => {
  // State for scheduling fields
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [frequency, setFrequency] = useState('once');
  const [customDates, setCustomDates] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [monthlyType, setMonthlyType] = useState('date');
  const [monthlyDate, setMonthlyDate] = useState(1);
  const [monthlyDay, setMonthlyDay] = useState({ week: 1, day: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Populate fields if editing an existing schedule
  useEffect(() => {
    // Always log the newsletter and its schedule when modal opens
    console.log('Editing newsletter:', newsletter);
    console.log('Editing schedule data:', newsletter?.schedule);
    if (newsletter?.schedule) {
      // Set frequency
      setFrequency(newsletter.schedule.frequency || 'once');
      
      // Set schedule time with proper format validation
      if (newsletter.schedule.scheduleTime) {
        const timeStr = newsletter.schedule.scheduleTime;
        // Ensure time is in HH:mm format
        if (/^\d{1,2}:\d{2}$/.test(timeStr)) {
          setScheduleTime(timeStr);
        } else {
          // Try to parse and format the time
          try {
            const [hours, minutes] = timeStr.split(':').map(Number);
            if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
              setScheduleTime(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
            } else {
              setScheduleTime('10:00'); // Default fallback
            }
          } catch (error) {
            setScheduleTime('10:00'); // Default fallback
          }
        }
      }
      
      try {
        // Set start date
        if (newsletter.schedule.startDate) {
          const startDateObj = new Date(newsletter.schedule.startDate);
          if (!isNaN(startDateObj.getTime())) {
            setStartDate(startDateObj);
          }
        }
        
        // Set end date
        if (newsletter.schedule.endDate) {
          const endDateObj = new Date(newsletter.schedule.endDate);
          if (!isNaN(endDateObj.getTime())) {
            setEndDate(endDateObj);
          }
        }
        
        // Set custom dates
        if (newsletter.schedule.customDates?.length) {
          const validDates = newsletter.schedule.customDates
            .map(date => new Date(date))
            .filter(date => !isNaN(date.getTime()));
          setCustomDates(validDates);
        }
        
        // Set weekdays for weekly frequency
        if (newsletter.schedule.weekdays?.length) {
          const validWeekdays = newsletter.schedule.weekdays
            .map(day => Number(day)) // Ensure numbers
            .filter(day => day >= 0 && day <= 6 && !isNaN(day));
          setSelectedWeekdays(validWeekdays);
        }
        
        // Set monthly configuration
        if (newsletter.schedule.frequency === 'monthly') {
          setMonthlyType('date');
          // Prefer nextSendDate's day if available, else use monthlyConfig.date
          if (newsletter.schedule.nextSendDate) {
            const nextSend = new Date(newsletter.schedule.nextSendDate);
            if (!isNaN(nextSend.getTime())) {
              setMonthlyDate(nextSend.getDate());
            }
          } else if (newsletter.schedule.monthlyConfig && newsletter.schedule.monthlyConfig.date) {
            setMonthlyDate(newsletter.schedule.monthlyConfig.date);
          }
        } else if (newsletter.schedule.monthlyConfig) {
          setMonthlyType(newsletter.schedule.monthlyConfig.type || 'date');
          setMonthlyDate(newsletter.schedule.monthlyConfig.date || 1);
          setMonthlyDay(newsletter.schedule.monthlyConfig.day || { week: 1, day: 1 });
        }
      } catch (error) {
        // Fallback to defaults if parsing fails
        setStartDate(new Date());
        setEndDate(null);
        setCustomDates([]);
        setSelectedWeekdays([]);
      }
    } else {
      // Reset to defaults when no schedule exists
      setFrequency('once');
      setScheduleTime('10:00');
      setStartDate(new Date());
      setEndDate(null);
      setCustomDates([]);
      setSelectedWeekdays([]);
      setMonthlyType('date');
      setMonthlyDate(1);
      setMonthlyDay({ week: 1, day: 1 });
    }
  }, [newsletter]);

  // Ensure weekdays are properly initialized when frequency changes to weekly
  useEffect(() => {
    if (frequency === 'weekly' && selectedWeekdays.length === 0 && newsletter?.schedule?.weekdays?.length) {
      const validWeekdays = newsletter.schedule.weekdays
        .map(day => Number(day))
        .filter(day => day >= 0 && day <= 6 && !isNaN(day));
      setSelectedWeekdays(validWeekdays);
    }
  }, [frequency, newsletter?.schedule?.weekdays, selectedWeekdays.length]);

  /**
   * Handle time picker change
   * @param {object} time - Dayjs object
   */
  const handleTimeChange = (time) => {
    if (time && time.isValid()) {
      const formattedTime = time.format('HH:mm');
      setScheduleTime(formattedTime);
    } else {
      setScheduleTime('10:00'); // Default fallback
    }
  };

  /**
   * Handle scheduling the newsletter
   */
  const handleSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate time format
      if (!scheduleTime || !/^\d{1,2}:\d{2}$/.test(scheduleTime)) {
        throw new Error('Invalid time format. Use HH:MM format (e.g., 14:30)');
      }
      
      // Validate time values
      const [hours, minutes] = scheduleTime.split(':').map(Number);
      if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
        throw new Error('Invalid time values. Hours must be 0-23, minutes must be 0-59');
      }
      
      // Validate frequency-specific requirements
      if (frequency === 'weekly' && selectedWeekdays.length === 0) {
        throw new Error('Please select at least one weekday for weekly schedule');
      }
      
      if (frequency === 'custom' && customDates.length === 0) {
        throw new Error('Please select at least one date for custom schedule');
      }
      
      const scheduleData = {
        frequency,
        scheduleTime,
        startDate: dayjs(startDate).format('YYYY-MM-DD'),
        endDate: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        customDates: frequency === 'custom' ? customDates.map(date => dayjs(date).format('YYYY-MM-DD')) : null,
        weekdays: frequency === 'weekly' ? selectedWeekdays : null,
        monthlyConfig: frequency === 'monthly' ? {
          type: monthlyType,
          date: Number(monthlyDate),
          day: monthlyType === 'day'
            ? {
                week: Number.isFinite(Number(monthlyDay?.week)) && Number(monthlyDay?.week) > 0 && Number(monthlyDay?.week) <= 4 ? Number(monthlyDay.week) : 1,
                day: Number.isFinite(Number(monthlyDay?.day)) && Number(monthlyDay?.day) >= 0 && Number(monthlyDay?.day) <= 6 ? Number(monthlyDay.day) : 0
              }
            : undefined
        } : null
      };
      
      if (newsletter.schedule) {
        await newsletterApi.updateSchedule(newsletter._id, scheduleData);
        toast.success('Schedule updated successfully');
      } else {
        await newsletterApi.scheduleNewsletter(newsletter._id, scheduleData);
        toast.success('Newsletter scheduled successfully');
      }
      onClose();
      onSchedule();
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error scheduling newsletter';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle cancelling the schedule
   */
  const handleCancelSchedule = async () => {
    setShowCancelConfirm(true);
  };

  const confirmCancelSchedule = async () => {
    try {
      setLoading(true);
      setError(null);
      await newsletterApi.cancelSchedule(newsletter._id);
      toast.success('Schedule cancelled successfully');
      setShowCancelConfirm(false);
      onClose();
      onSchedule();
    } catch (error) {
      setError(error.response?.data?.message || 'Error cancelling schedule');
      toast.error(error.response?.data?.message || 'Error cancelling schedule');
    } finally {
      setLoading(false);
    }
  };

  // Accessibility: trap focus and close on ESC
  // (Handled by AnimatePresence/modal parent in most cases)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md p-6"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">
                {newsletter?.schedule ? 'Edit Schedule' : 'Schedule Newsletter'}
              </h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-500" aria-label="Close schedule modal">
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            {newsletter?.schedule && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Current Schedule:</strong> {newsletter.schedule.frequency} at {newsletter.schedule.scheduleTime}
                  {newsletter.schedule.nextSendDate && (
                    <span className="block text-xs text-blue-600 mt-1">
                      Next send: {dayjs(newsletter.schedule.nextSendDate).format('MMM D, YYYY h:mm A')}
                    </span>
                  )}
                  {newsletter.schedule.weekdays && (
                    <span className="block text-xs text-blue-600 mt-1">
                      Weekdays: {newsletter.schedule.weekdays.map(day => WEEKDAYS.find(w => w.value === day)?.label).join(', ')}
                    </span>
                  )}
                </p>
              </div>
            )}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm" role="alert">
                {error}
              </div>
            )}
            

            <div className="space-y-4">
              {/* Frequency selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full rounded-md border border-gray-300 p-2"
                  disabled={loading}
                  aria-label="Select frequency"
                >
                  {FREQUENCY_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Time picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time
                </label>
                <TimePicker
                  value={scheduleTime ? dayjs(scheduleTime, 'HH:mm') : null}
                  onChange={handleTimeChange}
                  format="HH:mm"
                  minuteStep={1}
                  className="w-full"
                  disabled={loading}
                  popupClassName="newsletter-time-picker-dropdown"
                  style={{ width: '100%', height: '38px', borderRadius: '0.375rem' }}
                  aria-label="Select time"
                  placeholder="Select time"
                />
              </div>
              {/* Start date for recurring */}
              {frequency !== 'once' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    minDate={new Date()}
                    className="w-full rounded-md border border-gray-300 p-2"
                    disabled={loading}
                    aria-label="Select start date"
                  />
                </div>
              )}
              {/* Weekly selection */}
              {frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Weekdays
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {WEEKDAYS.map(day => (
                      <label key={`${day.value}-${newsletter?._id}`} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedWeekdays.includes(day.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedWeekdays(prev => [...prev, day.value]);
                            } else {
                              setSelectedWeekdays(prev => prev.filter(d => d !== day.value));
                            }
                          }}
                          disabled={loading}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          aria-label={`Select ${day.label}`}
                        />
                        <span className="text-sm text-gray-700">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {/* Monthly selection */}
              {frequency === 'monthly' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monthly Schedule Type
                    </label>
                    <div className="flex space-x-4">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          value="date"
                          checked={monthlyType === 'date'}
                          onChange={(e) => setMonthlyType(e.target.value)}
                          disabled={loading}
                          className="text-blue-600 focus:ring-blue-500"
                          aria-label="Day of Month"
                        />
                        <span className="text-sm text-gray-700">Day of Month</span>
                      </label>
                      {/* Removed Specific Day option from UI */}
                    </div>
                  </div>
                  {monthlyType === 'date' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Day of Month
                      </label>
                      <select
                        value={monthlyDate}
                        onChange={(e) => setMonthlyDate(Number(e.target.value))}
                        className="w-full rounded-md border border-gray-300 p-2"
                        disabled={loading}
                        aria-label="Select day of month"
                      >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {/* Removed Specific Day functionality from UI and logic */}
                </div>
              )}
              {/* Custom dates selection */}
              {frequency === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Dates
                  </label>
                  <DatePicker
                    selected={null}
                    onChange={(date) => setCustomDates([...customDates, date])}
                    minDate={new Date()}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholderText="Click to select multiple dates"
                    disabled={loading}
                    aria-label="Select custom dates"
                  />
                  {customDates.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Selected Dates:</h4>
                      <div className="flex flex-wrap gap-2">
                        {customDates.map((date, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-700 text-sm"
                          >
                            {dayjs(date).format('MMM D, YYYY')}
                            <button
                              onClick={() => setCustomDates(customDates.filter((_, i) => i !== index))}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                              disabled={loading}
                              aria-label={`Remove date ${dayjs(date).format('MMM D, YYYY')}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* End date for recurring */}
              {frequency !== 'once' && frequency !== 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={setEndDate}
                    minDate={startDate}
                    className="w-full rounded-md border border-gray-300 p-2"
                    placeholderText="No end date"
                    disabled={loading}
                    aria-label="Select end date"
                  />
                </div>
              )}
            </div>
            {/* Modal actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
                disabled={loading}
                aria-label="Cancel schedule modal"
              >
                Cancel
              </button>
              {newsletter?.schedule && (
                <button
                  onClick={handleCancelSchedule}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                  disabled={loading}
                  aria-label="Cancel newsletter schedule"
                >
                  Cancel Schedule
                </button>
              )}
              <button
                onClick={handleSchedule}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
                aria-label={newsletter?.schedule ? 'Update schedule' : 'Schedule newsletter'}
              >
                {loading ? 'Scheduling...' : newsletter?.schedule ? 'Update Schedule' : 'Schedule'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      <ConfirmationModal
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={confirmCancelSchedule}
        title="Cancel Schedule"
        message="Are you sure you want to cancel this schedule? The newsletter will return to draft status."
        confirmText="Cancel Schedule"
        cancelText="Keep Scheduled"
        type="warning"
      />
    </AnimatePresence>
  );
};

ScheduleModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  newsletter: PropTypes.object,
  onSchedule: PropTypes.func.isRequired
};

export default ScheduleModal;
// ===============================
// End of File: ScheduleModal.jsx
// Description: Modal for scheduling newsletters (frequency, time, custom dates, etc.).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 