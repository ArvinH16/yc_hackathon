"use client";

import * as React from 'react';

interface ExpandableTextProps {
  children: string;
  maxLength?: number;
  className?: string;
}

export function ExpandableText({
  children,
  maxLength = 150,
  className
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (children.length <= maxLength) {
    return <p className={className}>{children}</p>;
  }

  return (
    <div className={className}>
      <p className="inline">
        {isExpanded ? children : `${children.slice(0, maxLength)}...`}
      </p>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="ml-2 text-sm font-medium text-primary hover:underline"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </div>
  );
}

