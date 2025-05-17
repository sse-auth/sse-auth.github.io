import clsx from 'clsx';
import * as Icons from '../../icons/docs/admonition';
import React from 'react';

// ----------------------- Interfaces ---------------------------

interface ThemesProps {
  titleClassName: string;
  borderClassName: string;
  icon: React.ElementType;
}

interface Themes {
  note: ThemesProps;
  important: ThemesProps;
  tip: ThemesProps;
  warning: ThemesProps;
  info: ThemesProps;
  comingSoon: ThemesProps;
}

interface AdmonitionProps extends React.PropsWithChildren {
  type: keyof Themes;
  title: string;
  asHTML: boolean;
}

// ------------------------------ Code --------------------------

const themes: Themes = {
  note: {
    titleClassName: 'text-[#2982FF] dark:text-[#4C97FF]',
    borderClassName: 'border-[#2982FF] dark:border-[#4C97FF]',
    icon: Icons.NoteIcon,
  },
  important: {
    titleClassName: 'text-[#F9A806] dark:text-[#FFBB33]',
    borderClassName: 'border-[#F9A806] dark:border-[#FFBB33]',
    icon: Icons.ImportantIcon,
  },
  tip: {
    titleClassName: 'text-primary-2',
    borderClassName: 'border-primary-2',
    icon: Icons.TipIcon,
  },
  warning: {
    titleClassName: 'text-[#DA0A51] dark:text-secondary-1',
    borderClassName: 'border-[#DA0A51] dark:border-secondary-1',
    icon: Icons.WarningIcon,
  },
  info: {
    titleClassName: 'text-gray-new-50 dark:text-gray-5',
    borderClassName: 'border-gray-new-50 dark:border-gray-5',
    icon: Icons.InfoIcon,
  },
  comingSoon: {
    titleClassName: 'text-[#8873EF] dark:text-secondary-5',
    borderClassName: 'border-[#8873EF] dark:border-secondary-5',
    icon: Icons.ComingSoonIcon,
  },
};

const Admonition = ({ children = null, type = 'note', title, asHTML = false }: AdmonitionProps) => {
  const typeText = type == 'comingSoon' ? 'Coming soon' : type;
  const theme = themes[type] || themes.note;
  const Icon = theme.icon;

  return (
    <div
      className={clsx(
        'admonition not-prose bg-gray-new-98 dark:bg-gray-new-8 mt-5 rounded-[1px] border-l-4 px-5 py-4',
        theme.borderClassName,
        '[&_pre[data-language]]:dark:!bg-gray-new-8 [&_pre]:px-4 [&_pre]:py-3 [&_pre_code]:!text-sm [&_pre[data-language]]:!bg-white'
      )}
    >
      <div className={clsx('flex items-center gap-1.5', theme.titleClassName)}>
        <Icon width={14} height={14} />
        <h4 className="text-[13px] leading-none font-semibold tracking-normal uppercase">
          {title || typeText}
        </h4>
      </div>
      {asHTML ? (
        <div
          className="admonition-text mt-2.5 text-base"
          dangerouslySetInnerHTML={{ __html: typeof children === 'string' ? children : '' }}
        />
      ) : (
        <div className="admonition-text mt-2.5 text-base">{children}</div>
      )}
    </div>
  );
};
