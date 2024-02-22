import React, {useEffect, useRef, useState} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {Vector as VectorSource, XYZ as XYZSource} from 'ol/source';
import {defaults as DefaultControls, ZoomSlider} from 'ol/control'
import {Feature, Overlay} from "ol";
import {toStringHDMS} from "ol/coordinate";
import {fromLonLat, toLonLat} from "ol/proj";
import pin from '../../../asset/svg/pins';
import drawablePin from './../../../asset/svg/pins/drawable.svg';
import {useDispatch, useSelector} from '../../../hooks';
import {createProject} from "../../../services/redux/reducers/project/project.slice";
import {addProject} from '../../../services/redux/reducers/project/projects.slice';
import {MapCoordsType, RepresentationProps} from '../../../typings';
import VectorLayer from 'ol/layer/Vector';
import {Point} from 'ol/geom';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style';
import {Snap} from 'ol/interaction';
import {ProjectDetails} from '../../../typings/api';
import {getCanvasFromImage} from '../../../utils';
import OverLayUI from '../../../ui-components/overlay/Overlay.component';
import CreateProject from '../../../ui-components/project/create/CreateProject.component';
import {ProjectDataType} from '../../../ui-components/project/create/prop-types';
import {ProjectViewChange} from "../../../services/redux/reducers/auth/auth.slice";
import {loadKnowledgeTree} from "../../../services/redux/reducers/project/knowledge-tree.slice";
import { enableActivity, setSelection } from '../../../services/redux/reducers/map/map.slice';

type MapProps = {
    onPin?: (coordinates: MapCoordsType) => void;
    pins?: Array<ProjectDetails>;
    user?: any;
};

const MapLayers = (props: RepresentationProps) => {
    const [didClick, setDidClick] = useState(false);
    const [XYcoord, setXYcoord] = useState<string>('');
    const [coordinates, setCoordinates] = useState<number[]>([]);
    const [map, setMap] = useState<any>();
    const [overlayLocal, setOverlay] = useState<any>();
    const [popup, setPopup] = useState<any>();
    const [featureSource, setFeatureSource] = useState<any>();
    const [newProject, setNewProject] = useState<ProjectDetails>();
    const mapSourceUrl = 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    const mapElRef = useRef<any>();
    const overlayElRef = useRef<any>();
    const popupElRef = useRef<any>();
    const pinElRef = useRef<any>();

    const mapRef = useRef<any>();
    mapRef.current = map;
    const overlayRef = useRef<any>();
    overlayRef.current = overlayLocal;
    const popupRef = useRef<any>();
    popupRef.current = popup;
    const featureRef = useRef<any>();
    featureRef.current = featureSource;

    const dispatch = useDispatch();
    const mapMeta = useSelector(state => state.mapMeta);
    const resizer = useSelector(state => state.resizer.right_col);

    const createNewProject = async (data: ProjectDataType) => {
        const createdProject = await dispatch(createProject({...data, longitude:coordinates[0], latitude:coordinates[1] })).unwrap();
        const added = { ...(createdProject?.project ?? {}), tree: createdProject?.knowledgeBase?.tree, creator: props.user };
        dispatch(addProject(added));
        setNewProject(added);
    }
    const handleCreateDismiss = () => {
        setDidClick(false);
        dispatch(enableActivity('create_project'));
    }

    const handleMapClick = (event: any) => {
        const { coordinate, pixel } = event;
        const feature = mapRef.current?.forEachFeatureAtPixel(pixel, (feat: any) => feat);
        if (feature) {
            dispatch(ProjectViewChange({is_active: true, name: feature.get("name")}));
            dispatch(loadKnowledgeTree(feature.get("id")))
            setDidClick(false);
            return;
        } else {
            // popup
            const transformedCoord = toLonLat(coordinate);
            setCoordinates(transformedCoord);
            const hdms = toStringHDMS(transformedCoord);
            if (transformedCoord.length > 1) {
                if (props.onPin) {
                    props.onPin({ longitude: transformedCoord[0], latitude: transformedCoord[1] });
                    setDidClick(true);
                }
                dispatch(setSelection({ longitude: transformedCoord[0], latitude: transformedCoord[1], description: hdms }));
            }
            setXYcoord(hdms);
            setDidClick(true);
            overlayElRef.current.style.display = 'block';
            overlayRef.current?.setPosition(coordinate);
            discardPopup();
        }
    }

    const handlePointerMove = (event: any) => {
        const { coordinate, pixel } = event;
        mapRef.current.getTarget().style.cursor = '';
        // popup
        const feature = mapRef.current?.forEachFeatureAtPixel(pixel, (feat: any) => feat);
        if (feature) {
            discardPopup();
            mapRef.current.getTarget().style.cursor = 'pointer';
            popupRef.current?.setPosition(coordinate);
            if (popupElRef.current) {
                popupElRef.current.style = 'display: flex; flex-direction: column; position: relative; z-index: 20;';
                const name = feature.get('name');
                const description = feature.get('description');
                popupElRef.current.innerHTML = `
                    ${name ? `<h5>${name}</h5>` : ''}
                    ${description ? `<p>${description}</p>` : ''}
                `;
            }
        }
    };
    const handlePopUpClick =  (event: any) => {
        event?.stopPropagation();
    }
    const discardPopup = () => {
        if (popupElRef.current) {
            popupElRef.current.style = 'display: none;';
            popupElRef.current.innerHTML = '';
        }
    }
    useEffect(() => {
        if (resizer.top_row.height) {
            mapRef.current?.updateSize();
        }
    }, [resizer]);
    useEffect(() => {
        const overlay = new Overlay({
            element: overlayElRef?.current,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });
        // popups
        const popin = new Overlay({
            element: popupElRef?.current,
            positioning: 'bottom-center',
            stopEvent: false,
          });
        // features
        const feature = new VectorSource();
        // create map
        const initialMap = new Map({
            target: mapElRef?.current,
            overlays: [overlay, popin],
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        url: mapSourceUrl,
                        projection: 'EPSG:3857',
                    })
                }),
                new VectorLayer({
                    source: feature,
                }),
            ],
            // Add in the following map controls
            controls: DefaultControls().extend([
                new ZoomSlider(),
            ]),
            // Render the tile layers in a map view with a Mercator projection
            view: new View({
                projection: 'EPSG:3857',
                center: [3, 6000000],
                zoom: 5
            })
        });
        const snap = new Snap({
            source: feature,
        });
        initialMap.addInteraction(snap);
        // add map and layer to state
        setMap(initialMap);
        setOverlay(overlay);
        setPopup(popin);
        setFeatureSource(feature);
        // add listeners
        initialMap.on('click', handleMapClick);
        initialMap.on('pointermove', handlePointerMove);
        initialMap.on('movestart', discardPopup);
    }, []);
    // add features (pins) 
    useEffect(() => {
        setDidClick(false);
        if (map && featureSource && pinElRef.current && props.pins && props.pins?.length > 0) {
            // remove existing layers before rendering the map
            map.getLayers().getArray()?.forEach(
                (layer: unknown) => {
                    if (layer instanceof VectorLayer) {
                        layer.getSource()?.clear();
                    }
                }
            );
            const colorDef = { r: 237, g: 110, b: 64 };
            const img = getCanvasFromImage(drawablePin, colorDef);
            let pins = props.projects;
            if (props.activeProject?.id) {
                pins = [props.activeProject];
            }
            pins?.forEach(
                (pn: any, idx: any) => {
                    const iconFeature = new Feature({
                        geometry: new Point(fromLonLat([pn.longitude, pn.latitude])),
                        ...pn,
                    })
                    const iconStyle = new Style({
                        image: new Icon({
                            anchor: [0.5, 0],
                            anchorOrigin: 'bottom-right',
                            scale: 0.5,
                            src: pin.orange
                        }),
                        text: new Text({
                            font: '10px Calibri,sans-serif',
                            fill: new Fill({
                              color: `rgb(${colorDef.r},${colorDef.g},${colorDef.b})`,
                            }),
                            stroke: new Stroke({
                                color: "#fff",
                                width: 2,
                            }),
                            text: (props.pins?.length - (props.activeProject?.index ?? idx))?.toString() ?? '',
                            offsetY: -img.height / 3,
                          }),
                    });
                    iconFeature.setStyle(iconStyle);
                    featureSource?.addFeature(iconFeature);
                }
            );
            overlayElRef.current.style.display = 'none';
        }
    }, [props.pins, props.activeProject, map]);

    return (
        <>
            <div ref={mapElRef} className={"map"} id={"map"}>
                <div onClick={handlePopUpClick} ref={popupElRef} className='ol-tool-tip'/>
                <img ref={overlayElRef} src={pin.blue} className={"project-pointer"} />
            </div>
            <img ref={pinElRef} src={drawablePin} style={{ display: 'none'}} />
            {
                didClick && !!mapMeta.activities?.create_project && (
                    <OverLayUI show={didClick} el="#map" container=".background-layout" onDismiss={handleCreateDismiss}>
                        <code>{XYcoord}</code>
                        <CreateProject project={newProject} onSubmit={createNewProject} onDismiss={handleCreateDismiss} />
                    </OverLayUI>
                )
            }
        </>
    );
};

export default MapLayers;
