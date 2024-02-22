const SearchIcon = ({ fill, background, style, ...props}: { fill?: string, background?: string, style?: any, [key: string]: any }) => {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" style={{
            ...({
                height: '1.5em',
                width: '1.5em',
                transform: 'translateX(-15%)',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
            }),
            ...(style ?? {})
        }} viewBox="0 0 100 100" >
            <circle cx="50" cy="50" r="50" fill={background}/>
            <g transform="translate(25 20)">
                <path id="Path_938" data-name="Path 938" d="M21.858,18.895a11.972,11.972,0,1,0-3.683,3.391L27,31.062a2.506,2.506,0,0,0,3.634-3.452c-.03-.032-.059-.061-.091-.091Zm-9.78.818a7.716,7.716,0,1,1,.005,0Zm0,0" transform="scale(1.5)" fill={fill ?? '#fff'}/>
            </g>
        </svg>

    );
};

export default SearchIcon;
