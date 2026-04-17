import React from 'react'
import styles from './ImageSlider.module.css'

// Import your local images
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
import img11 from '../../assets/images/image11.jpg'

const ImageSlider = () => {
  // Array of your 11 images
  const images = [
    img1, img2, img3, img4, img5,
    img6, img7, img8, img9, img10, img11
  ]

  // Duplicate images for seamless infinite scroll
  const allImages = [...images, ...images]

  return (
    <div className={styles.sliderContainer}>
      <div className={styles.sliderTrack}>
        {allImages.map((image, index) => (
          <div className={styles.slide} key={index}>
            <img src={image} alt={`Transport ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ImageSlider