'use client';

import dynamic from 'next/dynamic';

const JsonViewComponent = dynamic(() => import('@uiw/react-json-view'), {
  ssr: false,
});

interface JsonViewProps {
  value: any;
  style?: React.CSSProperties;
  collapsed?: number | boolean;
}

export function JsonView({ value, style, collapsed }: JsonViewProps) {
  return (
    <JsonViewComponent
      value={value}
      style={style}
      collapsed={collapsed}
    />
  );
}
