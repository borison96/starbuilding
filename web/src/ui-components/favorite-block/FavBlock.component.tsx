import './favorite-block.scss';
export type FavType = {
    label?: string;
    id?: string;
    iconName?: string;
};
export type FavBlockPropType = {
    favs: Array<FavType>;
    onClick?: (fav?: any) => void;
};
const placeHolder = {
    label: "empty",
    id: 0,
    iconName: "placeholder"
}
function FavBlock(props: FavBlockPropType) {
    const { favs } = props;
    const padFavs = favs.length >= 10 ? favs : [
        ...favs,
        ...Array(10 - favs.length).fill(placeHolder).map((f, id) => ({ ...f, id: f.label + id }))
    ];
    return (
        <div className='fav-block-container-0i'>
            <div className='fav-block-title'>Favoris</div>
            <div className='fav-blocks'>
                {
                    padFavs.map(
                        (fav: any) => <button className={`fav-btn ${fav.label}`} key={fav.id} type="button">{fav.label === "empty" ? "+" : fav.label}</button>
                    )
                }
            </div>
        </div>
    );
}

export default FavBlock;
