import { ReactElement } from "react";
import '../controls.scss';

export type ButtonPropType = {
    [key: string]: any;
    onClick?: () => void;
    round?: boolean;
    icon?: ReactElement<HTMLImageElement | HTMLOrSVGElement>;
    iconPlacement?: 'left' | 'right';
    children: any;
    btnClassName?: string;
}
function Button({ round, icon, iconPlacement, btnClassName, children, ...props }: ButtonPropType) {
    return (
        <button {...props} className={`btn-12cst-x ${round ? '_round' : ''} ${btnClassName ?? ''}`}>
            {
                icon && iconPlacement === 'left' ? <span style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>{icon}</span> : null
            }
            { children }
            {
                icon && iconPlacement !== 'left' ? <span style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}>{icon}</span> : null
            }
        </button>
    );
}
export default Button;
