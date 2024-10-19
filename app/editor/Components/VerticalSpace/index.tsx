import React from 'react';
import { Component } from '../index';


export type VerticalSpaceProps = {
  height: number;
};


const VerticalSpaceFC: React.FC<VerticalSpaceProps> = ({ height }) => {
  return <div style={{ height: `${height}px` }} />;
};

export const VerticalSpace: Component<VerticalSpaceProps> = {
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
  reactComponent: VerticalSpaceFC,
};

//export default VerticalSpaceComponent;
