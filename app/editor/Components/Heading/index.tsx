import React from 'react';
import { Component } from '../index';
//import styles from "./styles.module.css";

export type HeadingProps = {
    text: string;
    headingLevel: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    align: 'left' | 'center' | 'right';
};

const headingStyles = {
    h1: "text-5xl font-bold leading-tight text-gray-900",
    h2: "text-4xl font-semibold leading-snug text-gray-800",
    h3: "text-3xl font-semibold leading-snug text-gray-700",
    h4: "text-2xl font-medium leading-snug text-gray-600",
    h5: "text-xl font-medium leading-snug text-gray-600",
    h6: "text-lg font-medium leading-snug text-gray-600",
};

const HeadingFC: React.FC<HeadingProps> = ({ text, headingLevel, align }) => {
    return React.createElement(headingLevel, { style: { textAlign: align }, className: headingStyles[headingLevel] }, text);
};

export const Heading: Component<HeadingProps> = {
    label: 'Heading',
    defaultProps: {
        text: 'Believe you can',
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
                { label: 'Heading 1', value: 'h1' },
                { label: 'Heading 2', value: 'h2' },
                { label: 'Heading 3', value: 'h3' },
                { label: 'Heading 4', value: 'h4' },
                { label: 'Heading 5', value: 'h5' },
                { label: 'Heading 6', value: 'h6' },
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
