import React, { useState } from "react";
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

  return (
    <div className="home-slider">
      <div
        className="slider"
        style={{ transform: `translateX(-${(currentSlideId - 1) * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="slide"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="content">
              <h2>{slide.title}</h2>
              <p>{slide.description}</p>
              {slide.button && (
                <button onClick={slide.button.onClick}>
                  {slide.button.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <button className="prev" onClick={goToPrevSlide}>
        &#10094;
      </button>
      <button className="next" onClick={goToNextSlide}>
        &#10095;
      </button>
    </div>
  );
};

export default MySlider;
