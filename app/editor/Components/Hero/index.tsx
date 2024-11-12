import React from 'react';
import { Button, ButtonProps, Component } from '../index';
import styles from './styles.module.css';

export type HeroProps = {
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonLink: string;
    padding: string;
};

const HeroFC: React.FC<HeroProps> = ({ title, description, image, buttonLabel, buttonLink, padding }) => {
    return (
        <div className={`pt-${padding} pb-${padding} relative w-full h-[400px] overflow-hidden `} >
            <img
                src={image}
                alt="TODO"
                className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-center h-full max-w-2xl">
                    <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                        {title}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-300">
                        {description}
                    </p>
                    <div className="mt-10">
                        <button className="rounded-md bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 
                                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                            onClick={() => window.location.href = buttonLink}>{buttonLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Hero: Component<HeroProps> = {
    label: "Hero",
    fields: {
        title: {
            type: "text",
            label: "Title",
        },
        description: {
            type: "textarea",
            label: "Description",
        },
        image: {
            type: "text",
            label: "url",
        },
        buttonLabel: {
            type: "text",
            label: "Button Label",
        },
        buttonLink: {
            type: "text",
            label: "Button Link",
        },
        padding: {
            type: "text",
            label: "Padding",
        },
    },
    defaultProps: {
        title: "Our Story",
        description: "We are a team of passionate individuals who are dedicated to creating solutions that meet the needs of our customers",
        image: "/images/sunset2.jpg",
        buttonLabel: "Explore",
        buttonLink: "https://elasticpath.com",
        padding: "40px",
    },
    reactComponent: HeroFC,
};