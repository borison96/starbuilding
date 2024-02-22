const ArchitectureIcon = ({ fill, background, style, ...props}: { fill?: string, background?: string, style?: any, [key: string]: any }) => {
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
            <g id="_002-architect-1" data-name="002-architect-1" transform="translate(0 0)">
                <path id="Path_779" data-name="Path 779" d="M11.229,46.121a.368.368,0,0,1-.153-.033L.2,41.131a.323.323,0,0,1-.163-.441A.362.362,0,0,1,.5,40.536l10.726,4.887,10.726-4.887a.362.362,0,0,1,.469.154.323.323,0,0,1-.163.441L11.382,46.088a.37.37,0,0,1-.153.033Z" transform="translate(0.001 -26.364)" fill={ fill ?? '#ddd' }/>
                <path id="Path_780" data-name="Path 780" d="M11.229,51.121a.368.368,0,0,1-.153-.033L.2,46.131a.323.323,0,0,1-.163-.441A.362.362,0,0,1,.5,45.536l10.726,4.887,10.726-4.887a.361.361,0,0,1,.469.154.323.323,0,0,1-.163.441L11.382,51.088a.37.37,0,0,1-.153.033Z" transform="translate(0.001 -29.71)" fill={ fill ?? '#ddd' }/>
                <path id="Path_781" data-name="Path 781" d="M.33,42.816a.33.33,0,0,1-.33-.33V40.833a.33.33,0,0,1,.661,0v1.652A.33.33,0,0,1,.33,42.816Z" transform="translate(0.001 -26.709)" fill={ fill ?? '#ddd' }/>
                <path id="Path_782" data-name="Path 782" d="M62.33,42.816a.33.33,0,0,1-.33-.33V40.833a.33.33,0,0,1,.661,0v1.652A.33.33,0,0,1,62.33,42.816Z" transform="translate(-40.201 -26.709)" fill={ fill ?? '#ddd' }/>
                <path id="Path_783" data-name="Path 783" d="M31.33,57.816a.33.33,0,0,1-.33-.33V55.833a.33.33,0,0,1,.661,0v1.652A.33.33,0,0,1,31.33,57.816Z" transform="translate(-20.1 -36.407)" fill={ fill ?? '#ddd' }/>
                <path id="Path_784" data-name="Path 784" d="M41.357,53.825a.33.33,0,0,1,0-.661h0a.33.33,0,0,1,0,.661Z" transform="translate(-26.601 -34.841)" fill={ fill ?? '#ddd' }/>
                <path id="Path_785" data-name="Path 785" d="M56.357,46.567a.33.33,0,0,1,0-.661h0a.33.33,0,1,1,0,.661Z" transform="translate(-36.2 -30.29)" fill={ fill ?? '#ddd' }/>
                <path id="Path_786" data-name="Path 786" d="M51.357,48.986a.33.33,0,0,1,0-.661h0a.33.33,0,0,1,0,.661Z" transform="translate(-33.085 -31.858)" fill={ fill ?? '#ddd' }/>
                <path id="Path_787" data-name="Path 787" d="M46.357,51.406a.33.33,0,0,1,0-.661h0a.33.33,0,1,1,0,.661Z" transform="translate(-29.843 -33.22)" fill={ fill ?? '#ddd' }/>
                <path id="Path_788" data-name="Path 788" d="M36.357,56.245a.33.33,0,0,1,0-.661h0a.33.33,0,0,1,0,.661Z" transform="translate(-23.359 -36.46)" fill={ fill ?? '#ddd' }/>
                <path id="Path_789" data-name="Path 789" d="M21.357,53.825a.33.33,0,0,1,0-.661h0a.33.33,0,0,1,0,.661Z" transform="translate(-13.632 -34.841)" fill={ fill ?? '#ddd' }/>
                <path id="Path_790" data-name="Path 790" d="M6.357,46.567a.33.33,0,0,1,0-.661h0a.33.33,0,1,1,0,.661Z" transform="translate(-4.033 -30.29)" fill={ fill ?? '#ddd' }/>
                <path id="Path_791" data-name="Path 791" d="M11.357,48.986a.33.33,0,0,1,0-.661h0a.33.33,0,1,1,0,.661Z" transform="translate(-7.148 -31.858)" fill={ fill ?? '#ddd' }/>
                <path id="Path_792" data-name="Path 792" d="M16.357,51.406a.33.33,0,0,1,0-.661h0a.33.33,0,1,1,0,.661Z" transform="translate(-10.39 -33.22)" fill={ fill ?? '#ddd' }/>
                <path id="Path_793" data-name="Path 793" d="M26.357,56.245a.33.33,0,0,1,0-.661h0a.33.33,0,0,1,0,.661Z" transform="translate(-16.874 -36.46)" fill={ fill ?? '#ddd' }/>
                <path id="Path_794" data-name="Path 794" d="M17.213,31.664a.33.33,0,0,1-.144-.628l1.361-.658a.331.331,0,1,1,.288.6l-1.361.658A.335.335,0,0,1,17.213,31.664Z" transform="translate(-10.921 -20.179)" fill={ fill ?? '#ddd' }/>
                <path id="Path_795" data-name="Path 795" d="M.331,37.474a.33.33,0,0,1-.144-.628l3.766-1.822a.331.331,0,1,1,.288.6L.475,37.441a.331.331,0,0,1-.144.033Z" transform="translate(0 -23.14)" fill={ fill ?? '#ddd' }/>
                <path id="Path_796" data-name="Path 796" d="M42.69,31.662a.33.33,0,0,1-.144-.033l-1.359-.658a.331.331,0,0,1,.288-.6l1.359.658a.331.331,0,0,1-.144.628Z" transform="translate(-26.523 -20.179)" fill={ fill ?? '#ddd' }/>
                <path id="Path_797" data-name="Path 797" d="M54.7,37.471a.33.33,0,0,1-.144-.033l-3.766-1.822a.331.331,0,1,1,.288-.6l3.766,1.822a.331.331,0,0,1-.144.628Z" transform="translate(-32.569 -23.138)" fill={ fill ?? '#ddd' }/>
                <path id="Path_798" data-name="Path 798" d="M24.635,42.818a.331.331,0,0,1-.148-.035l-3.3-1.653a.331.331,0,1,1,.3-.591l3.156,1.579,3.157-1.579a.331.331,0,1,1,.3.591l-3.3,1.653A.333.333,0,0,1,24.635,42.818Z" transform="translate(-13.404 -26.711)" fill={ fill ?? '#ddd' }/>
                <path id="Path_799" data-name="Path 799" d="M24.635,8.811a.331.331,0,0,1-.148-.035l-3.3-1.653a.331.331,0,1,1,.3-.591l3.156,1.579,3.157-1.579a.331.331,0,0,1,.3.591l-3.3,1.653A.333.333,0,0,1,24.635,8.811Z" transform="translate(-13.404 -4.844)" fill={ fill ?? '#ddd' }/>
                <path id="Path_800" data-name="Path 800" d="M27.939,3.81a.331.331,0,0,1-.147-.035L24.634,2.2,21.478,3.775a.331.331,0,1,1-.3-.591l3.3-1.653a.33.33,0,0,1,.3,0l3.3,1.653a.331.331,0,0,1-.148.626Z" transform="translate(-13.404 -1.496)" fill={ fill ?? '#ddd' }/>
                <path id="Path_801" data-name="Path 801" d="M31.33,23.4a.33.33,0,0,1-.33-.33V11.827a.33.33,0,1,1,.661,0V23.065A.33.33,0,0,1,31.33,23.4Z" transform="translate(-20.1 -7.692)" fill={ fill ?? '#ddd' }/>
                <path id="Path_802" data-name="Path 802" d="M41.33,18.395a.33.33,0,0,1-.33-.33V6.826a.33.33,0,1,1,.661,0V18.064A.33.33,0,0,1,41.33,18.395Z" transform="translate(-26.585 -4.844)" fill={ fill ?? '#ddd' }/>
                <path id="Path_803" data-name="Path 803" d="M21.33,18.395a.33.33,0,0,1-.33-.33V6.826a.33.33,0,0,1,.661,0V18.064A.33.33,0,0,1,21.33,18.395Z" transform="translate(-13.616 -4.844)" fill={ fill ?? '#ddd' }/>
                <path id="Path_804" data-name="Path 804" d="M25.65,38.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,1,1,.3-.591L25.8,37.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -24.49)" fill={ fill ?? '#ddd' }/>
                <path id="Path_805" data-name="Path 805" d="M25.65,34.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,1,1,.3-.591L25.8,33.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -21.898)" fill={ fill ?? '#ddd' }/>
                <path id="Path_806" data-name="Path 806" d="M25.65,30.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,0,1,.3-.591L25.8,29.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -19.308)" fill={ fill ?? '#ddd' }/>
                <path id="Path_807" data-name="Path 807" d="M25.65,26.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,0,1,.3-.591L25.8,25.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -16.717)" fill={ fill ?? '#ddd' }/>
                <path id="Path_808" data-name="Path 808" d="M25.65,22.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,0,1,.3-.591L25.8,21.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -14.127)" fill={ fill ?? '#ddd' }/>
                <path id="Path_809" data-name="Path 809" d="M25.65,18.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,0,1,.3-.591L25.8,17.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -11.535)" fill={ fill ?? '#ddd' }/>
                <path id="Path_810" data-name="Path 810" d="M25.65,14.322a.331.331,0,0,1-.147-.035l-1.322-.661a.331.331,0,0,1,.3-.591L25.8,13.7a.33.33,0,0,1-.148.626Z" transform="translate(-15.525 -8.945)" fill={ fill ?? '#ddd' }/>
                <path id="Path_811" data-name="Path 811" d="M34.331,38.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,38.321Z" transform="translate(-21.996 -24.488)" fill={ fill ?? '#ddd' }/>
                <path id="Path_812" data-name="Path 812" d="M34.331,34.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,34.321Z" transform="translate(-21.996 -21.898)" fill={ fill ?? '#ddd' }/>
                <path id="Path_813" data-name="Path 813" d="M34.331,30.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,0,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,30.321Z" transform="translate(-21.996 -19.308)" fill={ fill ?? '#ddd' }/>
                <path id="Path_814" data-name="Path 814" d="M34.331,26.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,26.321Z" transform="translate(-21.996 -16.715)" fill={ fill ?? '#ddd' }/>
                <path id="Path_815" data-name="Path 815" d="M34.331,22.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,22.321Z" transform="translate(-21.996 -14.125)" fill={ fill ?? '#ddd' }/>
                <path id="Path_816" data-name="Path 816" d="M34.331,18.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,18.321Z" transform="translate(-21.996 -11.535)" fill={ fill ?? '#ddd' }/>
                <path id="Path_817" data-name="Path 817" d="M34.331,14.321a.331.331,0,0,1-.148-.626l1.322-.661a.331.331,0,1,1,.3.591l-1.322.661A.327.327,0,0,1,34.331,14.321Z" transform="translate(-21.996 -8.945)" fill={ fill ?? '#ddd' }/>
                <path id="Path_818" data-name="Path 818" d="M46.322,30.463A1.323,1.323,0,0,1,45,29.141c0-.377.381-2.645,1.322-2.645s1.322,2.268,1.322,2.645A1.323,1.323,0,0,1,46.322,30.463Zm0-3.3a3.949,3.949,0,0,0-.661,1.977.661.661,0,1,0,1.322,0A3.949,3.949,0,0,0,46.322,27.164Z" transform="translate(-29.076 -17.597)" fill={ fill ?? '#ddd' }/>
                <path id="Path_819" data-name="Path 819" d="M48.33,36.473a.33.33,0,0,1-.33-.33V33.83a.33.33,0,0,1,.661,0v2.312A.33.33,0,0,1,48.33,36.473Z" transform="translate(-31.123 -22.155)" fill={ fill ?? '#ddd' }/>
                <path id="Path_820" data-name="Path 820" d="M12.322,30.463A1.323,1.323,0,0,1,11,29.141c0-.377.381-2.645,1.322-2.645s1.322,2.268,1.322,2.645A1.323,1.323,0,0,1,12.322,30.463Zm0-3.3a3.949,3.949,0,0,0-.661,1.977.661.661,0,1,0,1.322,0A3.949,3.949,0,0,0,12.322,27.164Z" transform="translate(-7.107 -17.597)" fill={ fill ?? '#ddd' }/>
                <path id="Path_821" data-name="Path 821" d="M14.33,36.473a.33.33,0,0,1-.33-.33V33.83a.33.33,0,0,1,.661,0v2.312A.33.33,0,0,1,14.33,36.473Z" transform="translate(-9.077 -22.155)" fill={ fill ?? '#ddd' }/>
            </g>
        </svg>
    );
};

export default ArchitectureIcon;