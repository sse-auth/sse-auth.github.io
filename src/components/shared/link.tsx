'use client';

import clsx from 'clsx';
import NextLink from 'next/link';
import React, { forwardRef } from 'react';

import ArrowRightIcon from '../../icons/arrow-right.inline.svg';
import ExternalIcon from '../../icons/external.inline.svg';
import GlossaryIcon from '../../icons/glossary.inline.svg';
import getNodeText from '../../utils/get-node-text';
import sendGtagEvent from '../../utils/send-gtag-event';

// ----------------- Interface ---------------------
interface LinkProps extends React.PropsWithChildren<React.AnchorHTMLAttributes<HTMLAnchorElement>> {
  className?: string;
  to?: string;
  size?: keyof typeof styles.size;
  theme?: keyof typeof styles.theme;
  withArrow?: boolean;
  icon?: keyof typeof icons;
  prefetch?: boolean;
  tagName?: string;
  tagText?: string;
}

// -------------------- Code -----------------------

const underlineCommonStyles =
  'relative transition-colors duration-500 before:absolute before:-bottom-1.5 before:left-0 before:h-1.5 before:w-full before:transition-all before:duration-500 hover:before:bottom-full hover:before:opacity-0 before:pointer-events-none';

const styles = {
  base: 'inline-flex !leading-none items-center',
  size: {
    lg: 't-2xl font-semibold',
    md: 't-xl font-semibold',
    sm: 't-lg',
    xs: 't-base',
    '2xs': 't-sm',
  },
  theme: {
    black:
      'text-black transition-colors duration-200 hover:text-primary-2 dark:text-white dark:hover:text-primary-2',
    'black-no-hover': 'text-black',
    white: 'text-white transition-colors duration-200 hover:text-primary-2',
    'black-primary-1': `${underlineCommonStyles} before:bg-primary-1 hover:text-primary-1 dark:before:bg-primary-1 dark:text-white dark:hover:text-primary-1`,
    'black-secondary-3': `${underlineCommonStyles} before:bg-secondary-3 hover:text-secondary-3`,
    'black-secondary-5': `${underlineCommonStyles} before:bg-secondary-5 hover:text-secondary-5`,
    'underline-primary-1':
      'text-primary-1 border-b-2 border-primary-1 transition-colors duration-200 hover:border-transparent',
    blue: 'text-blue-80 transition-colors duration-200 hover:text-[#C6EAF1]',
    green: 'text-green-45 transition-colors duration-200 hover:text-[#00FFAA]',
    'blue-green':
      'text-secondary-8 transition-colors duration-200 hover:text-secondary-7 dark:text-green-45 dark:hover:text-[#00FFAA]',
    'green-underlined':
      'underline decoration-green-45/40 hover:decoration-green-45/100 text-green-45 transition-colors duration-500',
    'gray-30': 'text-gray-new-30 transition-colors duration-200 hover:text-green-45',
    'white-underlined':
      'underline decoration-white/40 hover:decoration-white/100 text-white transition-colors duration-500',
    'gray-50': 'text-gray-new-50 transition-colors duration-200 hover:text-green-45',
    'gray-70':
      'text-gray-new-70 dark:text-gray-new-70 transition-colors duration-200 hover:text-green-45',
    'grey-70-underlined':
      'underline underline-offset-4 decoration-gray-new-70/40 hover:decoration-gray-new-70/100 text-gray-new-70 transition-colors duration-500',
    'gray-80': 'text-gray-new-80 transition-colors duration-200 hover:text-green-45',
    'gray-90': 'text-gray-new-90 transition-colors duration-200 hover:text-green-45',
  },
};

const icons = {
  external: ExternalIcon,
  glossary: GlossaryIcon,
};

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className: additionalClassName = '',
      size = 'md',
      theme = 'black',
      to = '',
      withArrow = false,
      icon = undefined,
      tagName = undefined,
      tagText = undefined,
      children,
      prefetch = undefined,
      ...props
    },
    ref
  ) => {
    const className = clsx(
      size && theme && styles.base,
      styles.size[size],
      styles.theme[theme],
      additionalClassName,
      (withArrow || icon) && 'group inline-flex w-fit items-center gap-1'
    );

    const Icon = icon ? icons[icon] : undefined;

    const handleClick = () => {
      if (!tagName) return;
      sendGtagEvent('Link clicked', {
        style: theme,
        text: tagText || getNodeText(children),
        tag_name: tagName,
      });
    };

    const content = (
      <>
        {withArrow ? <span>{children}</span> : children}
        {withArrow && (
          <ArrowRightIcon className="-mb-px shrink-0 transition-transform duration-200 group-hover:translate-x-[3px]" />
        )}
        {Icon && <Icon className="-mb-px shrink-0" />}
      </>
    );

    // TODO: remove this when we upgrade to latest version of Next.js
    if (to?.includes('#')) {
      return (
        <a className={className} href={to} ref={ref} onClick={handleClick} {...props}>
          {content}
        </a>
      );
    }

    if (to?.startsWith('/')) {
      return (
        <NextLink
          className={className}
          href={to}
          ref={ref}
          prefetch={prefetch}
          onClick={handleClick}
          {...props}
        >
          {content}
        </NextLink>
      );
    }

    return (
      <a className={className} href={to} ref={ref} onClick={handleClick} {...props}>
        {content}
      </a>
    );
  }
);

export default Link;
