import React from 'react';
import { Component } from '../index';

export type TextProps = {
    text: string;
    align: 'left' | 'center' | 'right';
    padding?: string;
    // fontSize?: string;
    // fontWeight?: string;
    // color?: string;
    // maxWidth?: string;
};

const TextFC: React.FC<TextProps> = ({ text, align, padding }) => {
    return (
        <div style={{ 
                paddingTop: padding,
                paddingBottom: padding,
                 }}>
            <span style={{
                display: "block",
                textAlign: align,
                // fontSize: fontSize,
                // fontWeight: fontWeight,
                // color: color,
            }}>        
                {text}
            </span>
        </div>
    );
};

export const Text: Component<TextProps> = {   
    
    label: 'Text',
    defaultProps: {
        text: 'Hello World',
        align: 'left',
        padding: '10px',
    },
    fields: {
        text: {
            type: 'textarea',
            label: 'Text',
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
        padding: {
            type: 'text',
            label: 'Padding',
        },
    },
    reactComponent: TextFC,
};
