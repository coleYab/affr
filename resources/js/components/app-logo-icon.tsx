import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg 
            {...props} 
            viewBox="0 0 40 40" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Main Hexagonal Container */}
            <path 
                d="M20 2L36 11V29L20 38L4 29V11L20 2Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round" 
            />
            
            {/* Mirror 'A' Structure representing AfroEqub & Unity */}
            <path 
                d="M20 7L13.5 32M20 7L26.5 32M16.8 22H23.2" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />

            {/* The Union Point at the top of the 'A' */}
            <path 
                d="M20 7L22.5 12L20 15L17.5 12L20 7Z" 
                fill="#2875F7" 
            />

            {/* The Community Dot (Navy Accent) */}
            <circle 
                cx="31" 
                cy="29" 
                r="4.5" 
                fill="#1D2878" 
            />
            <circle 
                cx="31" 
                cy="29" 
                r="4.5" 
                stroke="currentColor" 
                strokeWidth="1"
            />
        </svg>
    );
}
