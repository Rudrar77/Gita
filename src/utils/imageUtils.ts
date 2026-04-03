// Image utility functions for managing multiple images
import image1 from '@/data/IMG-20250712-WA0001-BfgSRpGf.jpg';
import image2 from '@/data/IMG-20250712-WA0003-DiuDFTst.jpg';
import image3 from '@/data/IMG-20250712-WA0004-DmTLavOq.jpg';
import image4 from '@/data/IMG-20250712-WA0005-Rm6ii2eP.jpg';
import image5 from '@/data/IMG-20250712-WA0006-DLU_1EZl.jpg';
import image6 from '@/data/IMG-20250712-WA0007-GncgpAD_.jpg';
import image7 from '@/data/IMG-20250712-WA0008-DdFpKyiG.jpg';
import image8 from '@/data/IMG-20250712-WA0009-Cge0JXTs.jpg';

// Available images array
export const availableImages = [
  image1,
  image2,
  image3,
  image4,
  image5,
  image6,
  image7,
  image8,
];

// Get image by index with fallback
export const getImageByIndex = (index: number): string => {
  return availableImages[index % availableImages.length] || availableImages[0];
};

// Get image for chapter with rotation
export const getChapterImage = (chapterNumber: string): string => {
  const index = parseInt(chapterNumber) - 1; // Chapter numbers start from 1
  return getImageByIndex(index);
};

// Get image for mood with rotation
export const getMoodImage = (mood: string): string => {
  const moods = ['happy', 'sad', 'neutral', 'excited', 'anxious'];
  const index = moods.indexOf(mood);
  return getImageByIndex(index);
};

// Get random image from available images
export const getRandomImage = (): string => {
  const randomIndex = Math.floor(Math.random() * availableImages.length);
  return availableImages[randomIndex];
};

// Get image for specific theme
export const getThemeImage = (theme: string): string => {
  const themes: { [key: string]: number } = {
    'krishna': 0,
    'wisdom': 1,
    'meditation': 0,
    'devotion': 1,
    'action': 0,
    'knowledge': 1,
  };
  
  const index = themes[theme] || 0;
  return getImageByIndex(index);
};

// Check if image exists and is valid
export const isValidImage = (imagePath: string): boolean => {
  return imagePath && imagePath.length > 0;
};

// Get image with error handling
export const getSafeImage = (imagePath: string, fallback: string = availableImages[0]): string => {
  return isValidImage(imagePath) ? imagePath : fallback;
};

/*
CURRENT IMAGES IN USE:

The following images from src/data/ are being used across the project:
- IMG-20250712-WA0001.jpg
- IMG-20250712-WA0003.jpg
- IMG-20250712-WA0004.jpg
- IMG-20250712-WA0005.jpg
- IMG-20250712-WA0006.jpg
- IMG-20250712-WA0007.jpg
- IMG-20250712-WA0008.jpg
- IMG-20250712-WA0009.jpg

USAGE:
- HomeScreenWidget: Uses images for avatars and backgrounds
- ChapterDetail: Uses chapter-specific images as backgrounds
- ChapterGrid: Uses chapter-specific images for chapter icons

The system automatically rotates through available images for:
- Different chapters (getChapterImage)
- Random backgrounds (getRandomImage)
- Mood-specific images (getMoodImage)
- Theme-specific images (getThemeImage)

To add more images:
1. Place new images in src/data/ folder
2. Import them at the top of this file
3. Add them to the availableImages array
4. The system will automatically use them with rotation!
*/ 