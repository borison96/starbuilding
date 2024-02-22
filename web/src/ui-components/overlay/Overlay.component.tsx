import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, CSSProperties, useState, useEffect } from "react";
import './overlay.scss';

export type OverlayPropType = {
    container?: HTMLElement | Element | string;
    dimensions?: {
        width?: number;
        height?: number;
        x?: number;
        y?: number;
    },
    el?: HTMLElement | Element | string;
    children: ReactNode | ReactNode[];
    show: boolean;
    onDismiss?: () => void;
    className?: string;
};

function Overlay({ dimensions, el, container, show, onDismiss, className, children }: OverlayPropType) {
    const [copyStyle, setCopyStyle] = useState<CSSProperties>();
    const [copyContainerStyle, setCopyContainerStyle] = useState<CSSProperties>();
    const zIndex = 14;
    const defStyle: CSSProperties = {
        position: 'fixed',
        backgroundColor: 'rgba(255,255,255,0.5)',
        zIndex: zIndex + 1,
        transition: 'width 0.2s',
        overflowY: 'auto',
        paddingTop: 15,
    };
    const containerDefStyle: CSSProperties = {
        position: 'fixed',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: zIndex,
        transition: 'width 0.2s', 
    }
    const modifyStyle = () => {
        if (el) {
            let element = typeof el === 'string' ? document.querySelector(el) : el;
            if (element) {
                const dim = element.getBoundingClientRect();
                const copy = window.getComputedStyle(element);
                setCopyStyle({
                    width: dim.width,
                    height: dim.height,
                    top: dim.y,
                    left: dim.x,
                    borderRadius: copy.borderRadius,
                });
            }
        }
        if (container) {
            let containEl = typeof container === 'string' ? document.querySelector(container) : container;
            if (containEl) {
                const cDim = containEl.getBoundingClientRect();
                const cCopy = window.getComputedStyle(containEl);
                setCopyContainerStyle({
                    width: cDim.width,
                    height: cDim.height,
                    top: cDim.y,
                    left: cDim.x,
                    borderRadius: cCopy.borderRadius,
                });
            }
        }
    }
    useEffect(() => {
        modifyStyle();
        window.addEventListener('resize', modifyStyle);
        window.addEventListener('scroll', modifyStyle);
        return () => {
            window.removeEventListener('resize', modifyStyle);
            window.removeEventListener('scroll', modifyStyle);
        };
    }, [el]);

    return show ? (
        <div style={{
            ...(
                copyContainerStyle ?? {
                    width: dimensions?.width ?? '0vw',
                    height: dimensions?.height ??  '0vh',
                    top: dimensions?.y ?? 0,
                    left: dimensions?.x ?? 0,
                }
            ), ...containerDefStyle
        }}>
            <div style={{
                ...(
                    copyStyle ?? {
                        width: dimensions?.width ?? '0vw',
                        height: dimensions?.height ??  '0vh',
                        top: dimensions?.y ?? '100vh',
                        left: dimensions?.x ?? 0,
                    }
                ), ...defStyle
            }} className={`overlay-content-xs5 ${ className ?? ''}`}>
                {
                    typeof onDismiss === 'function' && (
                        <button onClick={onDismiss} className="data-dismiss">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    )
                }
                {children}
            </div>
        </div>
    ): null
    
}

export default Overlay;
