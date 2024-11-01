import React from 'react';
import { Component } from '../index';


export type CustomProps = {
    html: string;
};

export const CustomHtmlFC: React.FC<CustomProps> = ({ html }) => {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

export const CustomHtml: Component<CustomProps> = {
    label: "Custom HTML",
    fields: {
        html: {
            type: "html",
            label: "Custom HTML",
        },
    },
    reactComponent: CustomHtmlFC,
    defaultProps: {
        html: "<p>Hello World</p>",
    },
};
