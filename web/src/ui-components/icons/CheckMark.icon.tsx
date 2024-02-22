const CheckMarkIcon = ({ fill, background, style, ...props}: { fill?: string, background?: string, style?: any, [key: string]: any }) => {
    return (
        <svg {...props} tabIndex={0} role="button" style={{
            ...({
                height: '1.5em',
                width: '1.5em',
                transform: 'translateX(-15%) scale(0.5)',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
            }),
            ...(style ?? {})
        }} viewBox="0 0 45.701 45.7" fill={background ?? '#F3BE3D'}>
            <g>
                <g>
                    <path d="M20.687,38.332c-2.072,2.072-5.434,2.072-7.505,0L1.554,26.704c-2.072-2.071-2.072-5.433,0-7.504
                        c2.071-2.072,5.433-2.072,7.505,0l6.928,6.927c0.523,0.522,1.372,0.522,1.896,0L36.642,7.368c2.071-2.072,5.433-2.072,7.505,0
                        c0.995,0.995,1.554,2.345,1.554,3.752c0,1.407-0.559,2.757-1.554,3.752L20.687,38.332z"/>
                </g>
            </g>
        </svg>
    );
};

export default CheckMarkIcon;
