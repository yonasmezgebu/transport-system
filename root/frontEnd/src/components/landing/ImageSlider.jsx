import React, { useState, useEffect, useCallback, useRef } from 'react'
import styles from './ImageSlider.module.css'

import img1 from '../../assets/images/image1.jpg'
import img2 from '../../assets/images/image2.jpg'
import img3 from '../../assets/images/image3.jpg'
import img4 from '../../assets/images/image4.jpg'
import img5 from '../../assets/images/image5.jpg'
import img6 from '../../assets/images/image6.jpg'
import img7 from '../../assets/images/image7.jpg'
import img8 from '../../assets/images/image8.jpg'
import img9 from '../../assets/images/image9.jpg'
import img10 from '../../assets/images/image10.jpg'
import img11 from '../../assets/images/image11.png'

const ImageSlider = () => {
  const images = [
    img1, img2, img3, img4, img5,
    img6, img7, img8, img9, img10, img11
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef(null)

  const goToNext = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, images.length])

  const goToPrev = useCallback(() => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setTimeout(() => setIsTransitioning(false), 500)
  }, [isTransitioning, images.length])

  // Auto advance with pause on hover
  useEffect(() => {
    if (isHovered) return
    intervalRef.current = setInterval(() => {
      goToNext()
    }, 3500) // 3.5s total (0.5s slide + 3s pause)
    return () => clearInterval(intervalRef.current)
  }, [goToNext, isHovered])

  // Clear interval on unmount
  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  const trackTransform = `translateX(-${currentIndex * 100}%)`

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carouselWrapper}>
        <button 
          className={`${styles.navButton} ${styles.prevButton}`} 
          onClick={goToPrev}
          disabled={isTransitioning}
        >
          &#10094;
        </button>

        <div 
          className={styles.viewport}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className={styles.track}
            style={{ transform: trackTransform, transition: isTransitioning ? 'transform 0.5s ease' : 'none' }}
          >
            {images.map((img, idx) => (
              <div className={styles.slide} key={idx}>
                <img src={img} alt={`Transport ${idx + 1}`} className={styles.image} />
              </div>
            ))}
          </div>
        </div>

        <button 
          className={`${styles.navButton} ${styles.nextButton}`} 
          onClick={goToNext}
          disabled={isTransitioning}
        >
          &#10095;
        </button>
      </div>

      <div className={styles.dotsContainer}>
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === currentIndex ? styles.activeDot : ''}`}
            onClick={() => {
              if (isTransitioning) return
              setIsTransitioning(true)
              setCurrentIndex(idx)
              setTimeout(() => setIsTransitioning(false), 500)
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ImageSlider