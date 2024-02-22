import React, {useEffect, useState} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { Cluster, Vector as VectorSource, OSM as OSMSource, XYZ as XYZSource, TileWMS as TileWMSSource } from 'ol/source'
import { ScaleLine, ZoomSlider, OverviewMap, defaults as DefaultControls } from 'ol/control'
import {Overlay} from "ol";
import {toStringHDMS} from "ol/coordinate";
import {toLonLat} from "ol/proj";
import pin from './../../../asset/svg/pin.svg'
import { useDispatch } from '../../../hooks';
import {createProject} from "../../../services/redux/reducers/project/project.slice";
import { addProject } from '../../../services/redux/reducers/project/projects.slice';
import { MapCoordsType } from '../../../typings';

let isBuild = false;
type MapProps = {
    onPin?: (coordinates: MapCoordsType) => void,
};
const MapLayers = (props: MapProps) => {
    const [isBuild, setBuilding] = useState(false);
    const [didClick, setDidClick] = useState(false);
    const [XYcoord, setXYcoord] = useState<string>('');
    const [coordinate, setCoordinate] = useState<number[]>([]);

    const dispatch = useDispatch();

    const createProjectBtn = async () => {
        const createdProject = await dispatch(createProject({description:"", latitude:coordinate[0], longitude:coordinate[1], name:"Project 1"})).unwrap();
        dispatch(addProject(createdProject));
    }

    const buildMap = () => {
        let container = document.getElementById('popup') || undefined;
        let content = document.getElementById('content');
        let content2 = document.getElementById('content2');
        const overlay = new Overlay({
            element: container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
        });

        const map = new Map({
            //  Display the map in the div with the id of map
            target: 'map',
            overlays: [overlay],
            layers: [
                new TileLayer({
                    source: new XYZSource({
                        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        projection: 'EPSG:3857',
                    })
                }),
                //clusters
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

        map.on('singleclick', function (evt) {
            const coordinate = evt.coordinate;
            const hdms = toStringHDMS(toLonLat(coordinate));

            /*if (content) {
                content.innerHTML = "<p> Créer votre projet ici : </br>"+hdms+"</p>" +
                    "<button onClick=\'{() => {createProject(}}\'>Créer</button>";
            }*/
            if (content)
                content.innerHTML = "";
            if (content2)
                content2.innerHTML = "";
            setCoordinate(coordinate);
            if (props.onPin && coordinate.length > 1) {
                props.onPin({ latitude: coordinate[0], longitude: coordinate[1] });
            }
            setXYcoord(hdms)
            setDidClick(true);
            overlay.setPosition(coordinate);
        });

        container && container.addEventListener("click", function() {
            if (content2) {
                setDidClick(false)
                content2.innerHTML = "<p>Regardez votre projet ici :</p>";
            }
        });

        setBuilding(true)
    }

    useEffect(() => {
        if (!isBuild)
            buildMap();
    }, [])

    return (
        <>
        <div className={"map"} id={"map"}></div>
            <img src={pin} className={"project-pointer"} id={"popup"}></img>
            <div id="popup" className="ol-popup">
            <div id="content2"></div>
                {didClick && (
                    <div id="content">
                        <p>Créer votre projet ici : <br/> {XYcoord} </p>
                        <button onClick={() => {createProjectBtn()}}>Créer</button>
                    </div>
                    )}
            </div>
        </>
    );
};

export default MapLayers;
