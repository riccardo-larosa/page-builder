import React from 'react';
import { Component } from '../index';


export type CustomProps = {
    html: string;
};

export const CustomFC: React.FC<CustomProps> = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export const Custom: Component<CustomProps> = {
    label: "Custom HTML",
    fields: {
        html: {
            type: "html",
            label: "Custom HTML",
        },
    },
    reactComponent: CustomFC,
    defaultProps: {
        html: "<p>Hello World</p>",
    },
};
