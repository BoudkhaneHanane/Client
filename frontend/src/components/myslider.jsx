import React, { useState, useEffect } from "react";
import "./myslider.css"; // Import your CSS file

const MySlider = ({ slides }) => {
  const [currentSlideId, setCurrentSlideId] = useState(1); // Start with the first slide

  const goToSlide = (id) => {
    setCurrentSlideId(id);
  };

  const goToPrevSlide = () => {
    const prevSlideId =
      currentSlideId === 1 ? slides.length : currentSlideId - 1;
    setCurrentSlideId(prevSlideId);
  };

  const goToNextSlide = () => {
    const nextSlideId =
      currentSlideId === slides.length ? 1 : currentSlideId + 1;
    setCurrentSlideId(nextSlideId);
  };

  // Set interval for automatic slide transition
  useEffect(() => {
    const interval = setInterval(goToNextSlide, 3500); // Change slide every 5 seconds
    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [currentSlideId]);

  return (
    <div className="home-slider">
      <div
        className="slider"
        style={{ transform: `translateX(-${(currentSlideId - 1) * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="slide">
            <img src={slide.image} alt={slide.alt} />
          </div>
        ))}
      </div>
      <div className="prev" onClick={goToPrevSlide}>
        &#10094;
      </div>
      <div className="next" onClick={goToNextSlide}>
        &#10095;
      </div>
    </div>
  );
};

export default MySlider;
