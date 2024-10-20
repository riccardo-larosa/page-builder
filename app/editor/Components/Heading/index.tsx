import React from 'react';
import { Component } from '../index';

export type HeadingProps = {
    text: string;
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    align: 'left' | 'center' | 'right';
};

const HeadingFC: React.FC<HeadingProps> = ({ text, headingLevel, align }) => {
    return React.createElement(headingLevel, { style: { textAlign: align } }, text);
};

export const Heading: Component<HeadingProps> = {
    label: 'Heading',
    defaultProps: {
        text: 'Title',
        headingLevel: 'h1',
        align: 'center',
    },
    fields: {
        text: {
            type: 'text',
            label: 'Text',
        },
        headingLevel: {
            type: 'select',
            label: 'Heading Level',
            options: [
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
            ],
        },
        align: {
            type: 'select',
            label: 'Align',
            options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
            ],
        },
    },
    reactComponent: HeadingFC,
};
