import React from 'react';
import { Component } from '../index';


export type VerticalSpaceProps = {
  height: number;
};


const VerticalSpace: React.FC<VerticalSpaceProps> = ({ height }) => {
  return <div style={{ height: `${height}px` }} />;
};

const VerticalSpaceComponent: Component<VerticalSpaceProps> = {
  label: 'Vertical Space',
  defaultProps: {
    height: 20,
  },
  fields: {
    height: {
      type: 'number',
      label: 'Height',
      min: 0,
    } ,
  },
  reactComponent: VerticalSpace,
};

export default VerticalSpaceComponent;
