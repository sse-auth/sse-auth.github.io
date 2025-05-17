import clsx from 'clsx';
import { LazyMotion, domAnimation, m, useAnimation } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Link from './link';
import ArrowIcon from '../../icons/arrow-sm.inline.svg';

interface CardItemsList {
  className?: string;
  items: {
    icon: string;
    title: string;
    description: string;
    linkText?: string;
    url: string;
    isDisabled: boolean
  }[];
  ariaHidden?: boolean;
  size: 'lg' | 'md';
}

const CardItemsList: React.FC<CardItemsList> = ({ className = null, items, ariaHidden = false, size = 'md' }) => {
  const isLarge = size === 'lg';
  const [isLoad, setIsLoad] = useState(false);
  const [hoverCount, setHoverCount] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>();
  const controls = useAnimation();

  const borderLightVariants = useMemo(
    () => ({
      from: {
        opacity: 0,
      },
      to: {
        opacity: hoverCount === 0 ? [0, 1, 0.5, 1, 0.75, 1] : [0, 0.4, 0.2, 1, 0.5, 1],
        transition: {
          ease: 'easeInOut',
          duration: hoverCount === 0 ? 0.5 : 1,
        },
      },
      exit: {
        opacity: 0,
      },
    }),
    [hoverCount]
  );

  useEffect(() => {
    controls.start('to');
  }, [controls]);

  useEffect(() => {
    setIsLoad(true);
  }, []);
  return (
    <ul
      className={clsx(
        'grid grid-cols-3 md:grid-cols-1 2xl:gap-x-4',
        isLarge ? 'md:gap-y-3.5' : 'md:gap-y-2.5',
        className
      )}
      aria-hidden={ariaHidden}
    >
      {items.map(({ icon, title, description, linkText = null, url, isDisabled }, index) => (
        <li className="relative" key={index}>
          <Link
            className={clsx(
              'group border-gray-new-15 flex h-full min-h-[176px] flex-col rounded-[10px] border md:flex-row md:gap-x-3 lg:min-h-max xl:min-h-[165px]',
              isLarge
                ? 'p-5 sm:space-y-3 md:flex-col md:p-5 md:pb-6 lg:p-4 lg:pb-5 xl:pb-4'
                : 'px-5 pt-5 pb-4 lg:p-4 xl:p-3.5',
              { 'pointer-events-none': isDisabled }
            )}
            to={url}
            target={url.startsWith('http') ? '_blank' : '_self'}
            rel={url.startsWith('http') ? 'noopener noreferrer' : ''}
            onPointerEnter={() => {
              setActiveItemIndex(index);
              setHoverCount((prev) => (prev === 1 ? 0 : prev + 1));
              controls.start('to');
            }}
            onPointerLeave={() => {
              setActiveItemIndex(null);
              setHoverCount(0);
              controls.start('exit');
            }}
          >
            <img
              className={clsx('h-8 w-8', {
                'md:h-7 md:w-7': !isLarge,
              })}
              loading="lazy"
              src={icon}
              alt=""
              width={32}
              height={32}
              aria-hidden
            />
            <div
              className={clsx(
                isLarge ? 'mt-5 lg:mt-4' : 'mt-[38px] md:mt-0 lg:mt-7 xl:mt-8',
                'flex h-full flex-col'
              )}
            >
              <h3
                className={clsx('tracking-extra-tight text-xl leading-tight', {
                  'xl:text-lg': !isLarge,
                })}
              >
                {title}
              </h3>
              <p
                className={clsx(
                  'text-gray-new-70 mt-1.5 text-[15px] leading-tight font-light',
                  isLarge ? 'mb-9 md:mt-1 md:mb-3.5 lg:mt-1.5 lg:mb-6' : 'md:mt-2.5'
                )}
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {isLarge && !isDisabled && (
                <div className="text-green-45 mt-auto inline-flex items-baseline transition-colors duration-200 group-hover:text-[#00FFAA]">
                  <span className="tracking-extra-tight text-[15px] leading-none">
                    {linkText || 'View example'}
                  </span>
                  <ArrowIcon className="ml-1 shrink-0" />
                </div>
              )}
              {isLarge && isDisabled && (
                <div className="tracking-extra-tight text-gray-new-60 mt-auto self-start text-[15px] leading-none">
                  Coming soon
                </div>
              )}
            </div>
          </Link>
          <LazyMotion features={domAnimation}>
            <m.span
              className={clsx(
                'pointer-events-none absolute top-0 left-0 z-20 h-full w-full rounded-[10px] border transition-colors duration-300 md:border-transparent md:opacity-100',
                isLoad !== true && 'opacity-100',
                activeItemIndex === index ? 'border-green-45' : 'border-transparent'
              )}
              initial="from"
              exit="exit"
              variants={borderLightVariants}
              animate={controls}
              aria-hidden
            />
          </LazyMotion>
        </li>
      ))}
    </ul>
  );
};
