// ===============================
// File: NewslettersTable.jsx
// Description: Table for displaying newsletters with actions (edit, delete, send, schedule).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaEdit, FaTrash, FaPaperPlane, FaClock, FaTimes } from 'react-icons/fa';
import { Tooltip, Pagination } from 'antd';
import dayjs from 'dayjs';

/**
 * Table for displaying newsletters with actions
 * @param {Object} props
 * @param {Array} props.newsletters - List of newsletters
 * @param {number} props.currentPage - Current page number
 * @param {number} props.pageSize - Page size
 * @param {function} props.onPageChange - Handler for page change
 * @param {function} props.onEdit - Handler for edit action
 * @param {function} props.onDelete - Handler for delete action
 * @param {function} props.onSend - Handler for send action
 * @param {function} props.onSchedule - Handler for schedule action
 * @param {boolean} props.sending - Whether a send action is in progress
 * @param {function} props.isActionDisabled - Function to check if actions are disabled
 */
const NewslettersTable = ({
  newsletters,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onSend,
  onSchedule,
  onCancelSchedule,
  sending,
  isActionDisabled
}) => {
  const paginatedNewsletters = newsletters.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sent To</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedNewsletters.map((newsletter) => (
              <tr key={newsletter._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {newsletter?.subject || 'Untitled'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    newsletter?.status === 'sent'
                      ? 'bg-green-100 text-green-800'
                      : newsletter?.status === 'scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}>
                    {newsletter?.status === 'sent' ? 'Sent' : newsletter?.status === 'scheduled' ? 'Scheduled' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {newsletter?.schedule ? (
                    <div>
                      <div>{newsletter.schedule.frequency}</div>
                      <div className="text-xs text-gray-400">
                        {newsletter.schedule.nextSendDate ?
                          dayjs(new Date(newsletter.schedule.nextSendDate)).isValid() ?
                            dayjs(newsletter.schedule.nextSendDate).format('MMM D, YYYY h:mm A')
                            : 'Invalid Date'
                          : 'N/A'}
                      </div>
                    </div>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {newsletter?.createdAt ? dayjs(newsletter.createdAt).format('MMM DD, YYYY') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {newsletter?.sentTo?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(newsletter)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Edit newsletter"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <Tooltip title={isActionDisabled(newsletter) ? 'Delete is disabled for 24 hours after sending.' : ''}>
                    <button
                      onClick={() => !isActionDisabled(newsletter) && onDelete(newsletter)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${isActionDisabled(newsletter) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={isActionDisabled(newsletter)}
                      aria-label="Delete newsletter"
                    >
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </Tooltip>
                  <Tooltip title={isActionDisabled(newsletter) ? 'Send is disabled for 24 hours after sending.' : ''}>
                    <button
                      onClick={() => !isActionDisabled(newsletter) && onSend(newsletter._id)}
                      disabled={sending || isActionDisabled(newsletter)}
                      className={`inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${sending || isActionDisabled(newsletter) ? 'opacity-50 cursor-not-allowed' : ''}`}
                      aria-label="Send newsletter"
                    >
                      <FaPaperPlane className="mr-1" /> Send
                    </button>
                  </Tooltip>
                  {newsletter?.status === 'scheduled' ? (
                    <>
                      <button
                        onClick={() => onSchedule(newsletter)}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        aria-label="Edit schedule"
                      >
                        <FaClock className="mr-1" /> Edit Schedule
                      </button>
                      <button
                        onClick={() => onCancelSchedule(newsletter)}
                        className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                        aria-label="Cancel schedule"
                      >
                        <FaTimes className="mr-1" /> Cancel
                      </button>
                    </>
                  ) : newsletter?.status === 'draft' ? (
                    <button
                      onClick={() => onSchedule(newsletter)}
                      className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      aria-label="Schedule newsletter"
                    >
                      <FaClock className="mr-1" /> Schedule
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={newsletters.length}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

NewslettersTable.propTypes = {
  newsletters: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onSend: PropTypes.func.isRequired,
  onSchedule: PropTypes.func.isRequired,
  onCancelSchedule: PropTypes.func.isRequired,
  sending: PropTypes.bool.isRequired,
  isActionDisabled: PropTypes.func.isRequired
};

export default NewslettersTable;
// ===============================
// End of File: NewslettersTable.jsx
// Description: Table for displaying newsletters with actions (edit, delete, send, schedule).
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 