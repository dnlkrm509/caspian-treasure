import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from 'framer-motion';

const ImageSlider = ({ slides, onNextImage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const { scrollY } = useScroll();

    const opacityIMG = useTransform(scrollY, [0, 200, 300, 500], [1, 0.5, 0.5, 0])

    let intervalTime = 3000;

    useEffect(() => {
        const previousIndex = currentIndex;

        const interval = setInterval(() => {
            setCurrentIndex((prevSlide) => (prevSlide + 1) % slides.length);
          }, intervalTime);
      
        onNextImage(previousIndex, currentIndex);
        return () => clearInterval(interval);
    }, [slides.length, intervalTime])


    return (
        <div className="h-full relative">
            <motion.div
                whileHover={{ scale:[0.8, 1.1, 1] }}
                transition={{ type:'spring', stiffness:500 }}
                className='absolute top-[45%] left-0 mx-auto w-full z-[10]
                text-[45px] text-[#fff] font-bold cursor-pointer'>Caspian Treasure CAVIAR</motion.div>
            {slides.map((image, index) =>
                index === currentIndex ? (
                    <motion.img
                        whileHover={{ scale:1.03 }}
                        key={image.id}
                        src={image.url}
                        className="hover:cursor-pointer bg-cover w-full h-full rounded-[10px] bg-center"
                    />
                  ) : null
                )}
        </div>
    )
};

export default ImageSlider;