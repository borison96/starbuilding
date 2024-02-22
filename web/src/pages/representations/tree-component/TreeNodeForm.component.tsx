import React, { useEffect, useState, MouseEvent, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from '../../../hooks';
import { enableRepresentation } from '../../../services/redux/reducers/representation/representation.slice';
import { EmptyNodePlacementType, MapCoordsType, NewNodeDataType } from '../../../typings';
import { getCurrentLocation, intersectionObserver } from '../../../utils';
export type TreeNodeFormPropType = {
    placement: EmptyNodePlacementType;
    onSubmit: (node: NewNodeDataType) => void;
    mapCoords?: MapCoordsType;
    onClose?: () => void;
}
const TreeNodeForm = (props: TreeNodeFormPropType) => {
    const { placement, onSubmit, mapCoords, onClose } = props;
    const projectNodeTypes = useSelector(state => state.projectNodeTypes);
    const dispatch = useDispatch();
    const rect = placement?.el?.getBoundingClientRect();
    const [typeId, setTypeId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [latLong, setLatLong] = useState<Partial<GeolocationCoordinates>>(null);
    const [position, setPosition] = useState<{x: number, y: number}>({ x: rect?.x ?? 0, y: rect.y ?? 0 });
    const [locationError, setLocationError] = useState('');
    const ref = useRef<HTMLDivElement>();
    const allowedNodes = useMemo(
        () => projectNodeTypes?.payload?.filter((nodeType) => nodeType?.label !== "empty" && nodeType?.label !== "projet"),
        [projectNodeTypes],
    );
    useEffect(() => {
        if (projectNodeTypes.payload && projectNodeTypes.payload?.length > 0) {
            if (allowedNodes) {
                setTypeId(allowedNodes[0].id);
            }
        }
    }, [projectNodeTypes]);
    useEffect(() => {
        if (mapCoords) {
            setLatLong(mapCoords);
        } else if (placement?.node && placement?.node?.parent === null) {
            getCurrentLocation().then(
                (geolocation) => setLatLong(geolocation?.coords),
                (err) => {
                    console.log("error geting position", err);
                    setLocationError('Veuillez activer la localisation sur votre navigateur')
                }
            )
        }
    }, [mapCoords ,placement]);
    useEffect(() => {
        if (ref.current) {
           return intersectionObserver(ref.current, (entries) => {
                entries.forEach(
                    entry => {
                        if (entry.target == ref.current && entry.intersectionRatio > 0 && entry.intersectionRatio < 1) {
                            const ratio = 0.1; // this will trigger adding 0.1 * y till it is fully visible
                            setPosition(prev => ({ x: prev.x, y: prev.y - (ratio * prev.y)}))
                        }
                    }
                )
           }, { root: null, threshold: [0, 0.25, 0.5, 0.75, 1]});
        }
    }, []);
    const handleSubmit = () => {
        if (placement.node && name) {
            onSubmit({
                name,
                typeId,
                description,
                longitude: latLong?.longitude,
                latitude: latLong?.latitude,
                parentNodeId: placement?.node?.parent?.data?.attributes?.id,
            });
        }
    }
    const handleClose = (e: MouseEvent) => {
        if (onClose) {
            onClose();
        }
    }
    const handleSelectType = (nodeTypeId: string) => {
        const nodeType = projectNodeTypes?.payload?.find(t => t.id?.toString() === nodeTypeId);
        switch(nodeType?.label) {
            case 'ifc':
            case 'model_3d':
                dispatch(enableRepresentation('model_3d'));
                break;
            case 'documents':
                dispatch(enableRepresentation('files'));
                break;  
        }
        setTypeId(nodeTypeId);
    }
    return (
        <div ref={ref} style={{
            position: 'absolute',
            top: position.y + 25,
            left: position.x + 25,
            zIndex: 1100,
            transition: '.3s',
        }}>
            <div className='placement-form-u0'>
            <button className='placement-close-icon' onClick={handleClose}>
                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="24px" height="24px">
                    <path d="M 4.9902344 3.9902344 A 1.0001 1.0001 0 0 0 4.2929688 5.7070312 L 10.585938 12 L 4.2929688 18.292969 A 1.0001 1.0001 0 1 0 5.7070312 19.707031 L 12 13.414062 L 18.292969 19.707031 A 1.0001 1.0001 0 1 0 19.707031 18.292969 L 13.414062 12 L 19.707031 5.7070312 A 1.0001 1.0001 0 0 0 18.980469 3.9902344 A 1.0001 1.0001 0 0 0 18.292969 4.2929688 L 12 10.585938 L 5.7070312 4.2929688 A 1.0001 1.0001 0 0 0 4.9902344 3.9902344 z"/>
                </svg>
            </button>
                <div className='placement-title'>
                    Ajouter un nouveau {
                        placement?.node?.parent === null ? 'projet' : `nœud à ${placement?.node?.parent?.data?.name}`
                    }
                </div>
                {
                    placement.node?.parent &&
                    projectNodeTypes &&
                    !projectNodeTypes.isLoading &&
                    projectNodeTypes?.payload && 
                    projectNodeTypes?.payload?.length > 0 ? (
                        <select value={typeId} onChange={(e) => handleSelectType(e?.target?.value)}>
                            {
                                allowedNodes?.map((nodeType) => (
                                    <option key={nodeType?.id + nodeType?.label} value={nodeType?.id}>{nodeType?.label}</option>
                                ))
                            }
                        </select>
                    ) : null
                }
                {
                    (placement?.node?.parent === null) ? (
                        <input
                            readOnly
                            type='search'
                            placeholder={`Emplacement du projet`}
                            value={ latLong ? `${latLong?.longitude}, ${latLong?.longitude}` : ''}
                        />
                    ): null
                }
                <div style={{ position: 'relative' }}>
                    <span style={{ color: '#E33F1A', position: 'absolute', left: 5, top: '20%' }}>*</span>
                    <input required style={{ paddingLeft: 10 }} placeholder='nom' value={name} onChange={(e) => setName(e?.target?.value)}  />
                </div>
                <div>
                    <textarea placeholder='description' value={description} onChange={(e) => setDescription(e?.target?.value)}></textarea>
                </div>
                <div>
                    <button disabled={!name?.trim()} onClick={handleSubmit}>Add</button>
                </div>
            </div>
        </div>
    );
};

export default TreeNodeForm;
