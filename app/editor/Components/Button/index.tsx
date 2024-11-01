import React from 'react';
import { Component } from '../index';

export type ButtonProps = {
    id?: string;
    label: string;
    //onClick: () => void;
    href?: string;
};

const ButtonFC: React.FC<ButtonProps> = ({ id, label, href }) => {
    return <button 
            id={id}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => href && (window.location.href = href)}>{label}
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