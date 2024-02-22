import Button from "../../../controls/button/Button.component";
import { ScreenPropType } from "../prop-types";
import clap from '../../../../asset/svg/clap.svg';
function FinishScreen({ onNext, entrance, exit, onComplete  }: ScreenPropType) {
    const title = 'Ce projet est maintenant disponible!';
    const handleFinish = () => {
        onNext({});
        if (typeof onComplete === 'function') onComplete();
    }
    return (
        <div className={`proj-screen__container ${entrance ? 'entrance' : ''} ${exit ? 'exit' : ''}`}>
            <h3 className="proj-screen__title">{title}</h3>
            <h5 className="proj-screen__title">Grâce à vous, l’ensemble des acteurs va pouvoir rejoindre ce projet.</h5>
            <img width={150} src={clap} alt={title} />
            <Button onClick={handleFinish} round btnClassName="proj-continue-btn" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137" style={{ transform: 'rotate(175deg)' }}>
                    <path id="Flèche-chevron-s" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                </svg>           
            }>
                Accéder au projet
            </Button>
        </div>
    );
}

export default FinishScreen;
