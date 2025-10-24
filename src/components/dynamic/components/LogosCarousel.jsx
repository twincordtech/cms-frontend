// ===============================
// File: LogosCarousel.jsx
// Description: Carousel component for displaying a set of logos with optional title.
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// ===============================
import React from 'react';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

/**
 * LogosCarousel component displays a carousel of logos, often used for partners or clients.
 * Uses Swiper for smooth, responsive sliding.
 */
const LogosCarousel = ({ title, logos }) => {
  if (!logos || logos.length === 0) return null;

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Optional section title */}
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          </div>
        )}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={true}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            768: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          className="py-4"
        >
          {logos.map((logo, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center h-20 px-4">
                <img
                  src={logo.image}
                  alt={logo.name}
                  className="max-h-12 w-auto grayscale hover:grayscale-0 transition-all duration-200"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

LogosCarousel.propTypes = {
  title: PropTypes.string,
  logos: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired
    })
  ).isRequired
};

export default LogosCarousel;
// ===============================
// End of File: LogosCarousel.jsx
// Description: Carousel of logos
// Author: Tech4biz Solutions
// Copyright: Tech4biz Solutions Private
// =============================== 