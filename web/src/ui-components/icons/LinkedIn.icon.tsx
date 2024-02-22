const LinkedInIcon = ({ fill, background, ...props}: { fill?: string, background?: string, [key: string]: any }) => {
    return (
        <svg {...props} data-name="001-linkedin" xmlns="http://www.w3.org/2000/svg" width="23.998" height="23.998" viewBox="0 0 23.998 23.998">
            <circle data-name="Ellipse 115" cx="11.999" cy="11.999" r="11.999" fill={background ?? '#295EA7' }/>
            <g id="Group_2158" data-name="Group 2158" transform="translate(5.79 5.127)">
                <path id="Path_963" data-name="Path 963" d="M40.446,31.806v4.947H37.578V32.138c0-1.159-.414-1.95-1.453-1.95a1.569,1.569,0,0,0-1.471,1.049,1.963,1.963,0,0,0-.095.7v4.818H31.691s.038-7.817,0-8.626H34.56v1.222c-.006.01-.014.019-.019.028h.019v-.028a2.848,2.848,0,0,1,2.585-1.425c1.887,0,3.3,1.233,3.3,3.882ZM28.691,23.969a1.495,1.495,0,1,0-.038,2.981h.019a1.5,1.5,0,1,0,.019-2.981ZM27.238,36.753h2.867V28.127H27.238Z" transform="translate(-27.068 -23.969)" fill={fill ?? '#eee'} />
            </g>
        </svg>
    );
};

export default LinkedInIcon;
