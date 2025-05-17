import React from 'react';

interface NodeWithProps {
  props: {
    children?: React.ReactNode;
    [key: string]: any;
  };
}

export default function getNodeText(node: React.ReactNode): string {
  if (node == null) return '';

  switch (typeof node) {
    case 'string':
    case 'number':
      return node.toString();

    case 'boolean':
      return '';

    case 'object': {
      if (Array.isArray(node)) return node.map(getNodeText).join(' ').trim();

      if ('props' in node) return getNodeText((node as NodeWithProps).props.children);
    }

    default:
      console.warn('Unresolved `node` of type:', typeof node, node);
      return '';
  }
}
