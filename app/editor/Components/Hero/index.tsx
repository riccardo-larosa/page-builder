import React from 'react';
import { Button, ButtonProps, Component } from '../index';

export type HeroProps = {
    title: string;
    description: string;
    image: string;
    buttonLabel: string;
    buttonLink: string;
    padding: string;
};

const HeroFC: React.FC<HeroProps> = ({ title, description, image, buttonLabel, buttonLink, padding }) => {
    return <div style={{ 
            paddingTop: padding,
            paddingBottom: padding,
            }}>
                <div id="hero-image" style={{ backgroundImage: `url(${image})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: '50% 50%', 
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    left: '0',
                    top: '0',
                    inset: '0px',
                    }} />
                <div style={{ backgroundImage: 'linear-gradient(-90deg, hsla(0, 0%, 100%, 0), #f7faff 50%)',
                    position: 'absolute',
                    right: '0',
                    bottom: '0',
                    left: '0',
                    top: '0',
                    }} />
                <div id="hero-content" style={{ position: 'relative', zIndex: '1', maxWidth: '50%' }}>
                    <h1>{title}</h1>
                    <p>{description}</p>
                    <div id="hero-button" style={{ marginTop: '20px' }}>
                        <button 
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={() => window.location.href=buttonLink}>{buttonLabel}
                        </button>
                    </div>
                </div>
            </div>;
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