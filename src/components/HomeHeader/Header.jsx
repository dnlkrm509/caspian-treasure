import { useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';

import ImageSlider from "./ImageSlider.jsx";
import slides from '../../data/slides.js';

function Header() {
  const [items, setItems] = useState(slides);

  const { scrollY } = useScroll();

  const opacityIMG = useTransform(scrollY, [0, 200, 300, 500], [1, 0.5, 0.5, 0]);


  const nextImageHandler = (previousSlideId, slideId) => {
    let updatedSlides = [];
    let updatedNewSlide;
    let updatedPreviousSlide;

    updatedPreviousSlide = {
      ...items[previousSlideId],
      isSelected: !items[previousSlideId].isSelected
    }

    updatedNewSlide = {
      ...items[slideId],
      isSelected: !items[slideId].isSelected
    }
    

    updatedSlides = [
      ...items
    ]

    updatedSlides[slideId] = updatedNewSlide;

    updatedSlides[previousSlideId] = updatedPreviousSlide;

    setItems(updatedSlides);
  };

  return (
    <motion.div
      style={{ opacity: opacityIMG }}
      className='card w-3/4 h-[700px] mx-auto shadow shadow-gray-600 rounded-[10px]'>
        <ImageSlider
          slides={items}
          onNextImage={nextImageHandler} 
        />
    </motion.div>
  );
}

export default Header;