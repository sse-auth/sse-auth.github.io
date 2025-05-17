'use client';

import Image from 'next/image';
import { Fragment } from 'react';
import Link from './link';

// ------------------------- Interfaces ------------------------
interface AuthorProps {
  isBlogPost?: boolean;
  author: {
    title: string;
    postAuthor: {
      role?: string;
      image: {
        mediaItemUrl: string;
      };
    };
  };
}

interface BlogPostAuthorsProps {
  isBlogPost: boolean;
  authors: {
    author: {
      title: string;
      postAuthor: {
        url?: string;
        role?: string;
        image: {
          mediaItemUrl: string;
        };
      };
    };
  }[];
}

// ------------------- Components -----------------------
const Author: React.FC<AuthorProps> = ({ author, isBlogPost = false }) => (
  <div className="flex items-center">
    <Image
      className="w-10 shrink-0 rounded-full"
      src={author.postAuthor?.image?.mediaItemUrl}
      width={40}
      height={40}
      quality={85}
      alt={author.title}
    />
    <span className="group-hover:text-primary-1 group-active:text-primary-1 ml-3 flex flex-col text-lg leading-none transition-colors duration-200">
      <span className="font-semibold">{author.title}</span>
      {isBlogPost && <span className="mt-1">{author.postAuthor?.role}</span>}
    </span>
  </div>
);

const BlogPostAuthors: React.FC<BlogPostAuthorsProps> = ({ authors, isBlogPost = false }) =>
  authors?.map(({ author }, index) => (
    <Fragment key={index}>
      {author.postAuthor.url ? (
        <Link
          className="group"
          to={author.postAuthor.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Author author={author} isBlogPost={isBlogPost} />
        </Link>
      ) : (
        <Author author={author} isBlogPost={isBlogPost} />
      )}
    </Fragment>
  ));

export default BlogPostAuthors;
