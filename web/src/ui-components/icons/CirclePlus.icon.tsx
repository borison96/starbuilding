const CirclePlusIcon = ({ fill, background, style, ...props}: { fill?: string, background?: string, style?: any, [key: string]: any }) => {
    return (
        <svg {...props} tabIndex={0} role="button" style={{
            ...({
                height: '1.5em',
                width: '1.5em',
                transform: 'translateX(-15%)',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
            }),
            ...(style ?? {})
        }} viewBox="0 0 100 100" fill={background ?? '#F3BE3D'}>
            <circle cx={50} cy={50} r={50}></circle>
            <text textAnchor="middle" x={50} y={75} fill={fill ?? '#fff'} fontSize={100}>+</text>
        </svg>
    );
};

export default CirclePlusIcon;