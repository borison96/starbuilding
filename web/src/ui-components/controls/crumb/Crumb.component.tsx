const Crumb = ({ value, onDismiss, background }: { value: string, background?: string; onDismiss: (value: string) => void}) => {
    return (
        <div title={value} style={{margin: 3, borderRadius: 10, display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: background ?? '#eee', color: '#303643' }}>
            <div style={{ flex: 2, margin: '5px 10px', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
            <button style={{
                border: 'none',
                outline: 'none',
                width: 25,
                height: 25,
                borderRadius: '50%',
                background: '#303643',
                color: '#eee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 5px',
            }} onClick={() => onDismiss(value)}><span style={{ transform: 'translateY(-10%)'}}>x</span></button>
        </div>
    );
};

export default Crumb;
