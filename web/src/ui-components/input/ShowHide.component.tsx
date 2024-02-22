const ShowHide = ({ show, onClick }: { show: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        type="button"
        style={{ textDecoration: 'underline', fontSize: 12, padding: '0 15px' }}
    >
        { show ? 'Cacher' : 'Afficher' }
    </button>
);

export default ShowHide;
