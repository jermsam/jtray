import {largestRect} from 'rect-scaler';

export interface AspectRatio {
  ratio: number,
  label: string,
  ratioClass: string,
}

const getUsableDimensions = (container: HTMLElement) => {
  const containerComputedStyle = getComputedStyle(container);
  const containerPaddingX =
    parseInt(containerComputedStyle.paddingLeft.replace('px', ''), 10) +
    parseInt(containerComputedStyle.paddingRight.replace('px', ''), 10);
  const containerPaddingY =
    parseInt(containerComputedStyle.paddingTop.replace('px', ''), 10) +
    parseInt(containerComputedStyle.paddingBottom.replace('px', ''), 10);
  
  const containerWidth = container.offsetWidth - containerPaddingX;
  const containerHeight = container.offsetHeight - containerPaddingY;
  
  return {containerWidth, containerHeight};
};

const resizer = (container: HTMLElement, {width, height, margin}: {
  width: number,
  height: number,
  margin: number,
}) => {
  const children = Array.from(container.children) as HTMLElement[];
  for (const child of children) {
    child.style.width = `${width}px`;
    child.style.height = `${height}px`;
    child.style.margin = `${margin / 2}px`;
    child.className = 'video-box';
  }
};

export const resize = (container: HTMLElement, margin: number, aspectRatio: AspectRatio) => {
  
  const tileCount = container.children.length;
  if (!tileCount) return;
  const containerDimensions = getUsableDimensions(container);
  
  const aspectArray = aspectRatio.label.split(':');
  const aspectWidth = Number(aspectArray[0]);
  const aspectHeight = Number(aspectArray[1]);
  const containerWidth = containerDimensions.containerWidth as number;
  const containerHeight = containerDimensions.containerHeight as number;
  
  const dimensions = largestRect(
    containerWidth,
    containerHeight,
    tileCount,
    aspectWidth,
    aspectHeight,
  );
  
  const width = dimensions.width - margin;
  const height = dimensions.height - margin;
  resizer(container, {
    width,
    height,
    margin,
  });
};


export function generateRandomColor() {
  // Generate random values for red, green, and blue components
  const red = Math.floor(Math.random() * 256);
  const green = Math.floor(Math.random() * 256);
  const blue = Math.floor(Math.random() * 256);
  
  // Convert values to hexadecimal and format the color string
  
  
  return '#' + red.toString(16).padStart(2, '0') +
    green.toString(16).padStart(2, '0') +
    blue.toString(16).padStart(2, '0');
}

export function isDarkColor(color: string) {
  // Extract the red, green, and blue components from the color string
  const red = parseInt(color.substring(1, 3), 16);
  const green = parseInt(color.substring(3, 5), 16);
  const blue = parseInt(color.substring(5, 7), 16);
  
  // Calculate the luminance of the color
  // The formula to calculate luminance is L = 0.2126 * R + 0.7152 * G + 0.0722 * B
  const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  
  // Check if the luminance is below a threshold to classify it as dark
  // You can adjust this threshold based on your preference
  const threshold = 128;
  return luminance < threshold;
}
