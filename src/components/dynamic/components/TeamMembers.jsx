// ===============================
// File: TeamMembers.jsx
// Description: Team members grid for displaying team profiles with images, roles, bios, and social links.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { FaLinkedin, FaTwitter, FaGithub, FaEnvelope } from 'react-icons/fa';

/**
 * TeamMembers component displays a grid of team member profiles with images, roles, bios, and social links.
 * Used for About Us or team introduction sections.
 */
const TeamMembers = ({ members }) => {
  if (!members || members.length === 0) return null;

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Our Team
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Meet the talented people behind our success
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-500">{member.role}</p>
                <p className="mt-3 text-sm text-gray-600">{member.bio}</p>
                {/* Social links for each member */}
                <div className="mt-4 flex space-x-4">
                  {member.social?.linkedin && (
                    <a
                      href={member.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <FaLinkedin className="h-5 w-5" />
                    </a>
                  )}
                  {member.social?.twitter && (
                    <a
                      href={member.social.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                    >
                      <FaTwitter className="h-5 w-5" />
                    </a>
                  )}
                  {member.social?.github && (
                    <a
                      href={member.social.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-gray-900 transition-colors"
                    >
                      <FaGithub className="h-5 w-5" />
                    </a>
                  )}
                  {member.social?.email && (
                    <a
                      href={`mailto:${member.social.email}`}
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <FaEnvelope className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TeamMembers.propTypes = {
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      bio: PropTypes.string,
      social: PropTypes.shape({
        linkedin: PropTypes.string,
        twitter: PropTypes.string,
        github: PropTypes.string,
        email: PropTypes.string
      })
    })
  ).isRequired
};

export default TeamMembers;
// ===============================
// End of File: TeamMembers.jsx
// Description: Team members grid
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 