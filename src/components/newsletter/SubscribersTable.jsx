// ===============================
// File: SubscribersTable.jsx
// Description: Table for displaying newsletter subscribers with edit and delete actions.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { Pagination, Tooltip } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import dayjs from 'dayjs';

/**
 * Table for displaying newsletter subscribers with actions
 * @param {Object} props
 * @param {Array} props.subscribers - List of subscribers
 * @param {number} props.currentPage - Current page number
 * @param {number} props.pageSize - Page size
 * @param {function} props.onPageChange - Handler for page change
 * @param {function} props.onEdit - Handler for edit action
 * @param {function} props.onDelete - Handler for delete action
 */
const SubscribersTable = ({
  subscribers,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete
}) => {
  const paginatedSubscribers = subscribers.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed At</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedSubscribers.map((subscriber) => (
              <tr key={subscriber._id || subscriber.email} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {subscriber?.email || 'No email'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    subscriber?.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {subscriber?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscriber?.createdAt ? dayjs(subscriber.createdAt).format('MMM DD, YYYY') : 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => onEdit(subscriber)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label="Edit subscriber"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(subscriber)}
                    className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label="Delete subscriber"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
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
          total={subscribers.length}
          onChange={onPageChange}
          showSizeChanger={false}
        />
      </div>
    </>
  );
};

SubscribersTable.propTypes = {
  subscribers: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default SubscribersTable;
// ===============================
// End of File: SubscribersTable.jsx
// Description: Table for displaying newsletter subscribers.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 