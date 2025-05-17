import shuffle from 'lodash.shuffle';
import React from 'react';

// ------------------------- Interfaces ------------------------
interface BlinkingTextProps extends React.PropsWithChildren {
  text: string;
  parentElement: HTMLElement | null;
  shouldAnimationStart: boolean;
}

const BlinkingText: React.FC<BlinkingTextProps> = ({
  text = '',
  parentElement = null,
  shouldAnimationStart = false,
  children = null,
}) => {
  React.useEffect(() => {
    if (parentElement && shouldAnimationStart) {
      const letters = parentElement.querySelectorAll('.animate-text-blink');
      const shuffledLetters = shuffle(letters);

      let currentTimeout = 0;
      shuffledLetters.forEach((letter) => {
        setTimeout(() => {
          // eslint-disable-next-line no-param-reassign
          (letter as HTMLElement).style.cssText = 'animation-play-state: running';
        }, currentTimeout);

        currentTimeout += 10;
      });
    }
  }, [parentElement, shouldAnimationStart]);

  return text
    ? text.split('').map((letter, index) => (
        <span className="animate-text-blink" style={{ animationPlayState: 'paused' }} key={index}>
          {letter}
        </span>
      ))
    : children;
};

export default BlinkingText;
