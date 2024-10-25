import React from 'react';
import { Component } from '../index';

export type ButtonProps = {
    label: string;
    //onClick: () => void;
    href?: string;
};

const ButtonFC: React.FC<ButtonProps> = ({ label, href }) => {
    return <button 
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => window.location.href=href}>{label}
            </button>;
};

export const Button: Component<ButtonProps> = {
    label: "Button",
    defaultProps: {
        label: "Click me",
        href: "https://elasticpath.com",
    },
    fields: {
        label: {
            type: "text",
            label: "Label",
        },
        href: {
            type: "text",
            label: "link",
        },
    },
    reactComponent: ButtonFC,
};