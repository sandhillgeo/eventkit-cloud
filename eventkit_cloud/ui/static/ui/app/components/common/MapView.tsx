import * as React from 'react';
import {MapLayer} from "../CreateDataPack/CreateExport";
import OlMapComponent from "../MapTools/OpenLayers/OlMapComponent";
import OlFeatureLayer from "../MapTools/OpenLayers/OlFeatureLayer";
import ZoomToAoi from "../MapTools/OpenLayers/ZoomToAoi";
import OlRasterTileLayer from "../MapTools/OpenLayers/OlRasterTileLayer";
import OlMouseWheelZoom from "../MapTools/OpenLayers/MouseWheelZoom";
import {RegionJustification} from "../StatusDownloadPage/RegionJustification";

export interface Props {
    geojson: object;
    selectedBaseMap: MapLayer | string;
    zoom?: number;
    copyright?: string;
    setZoom?: (from: number, to: number) => void;
    minZoom?: number;
    maxZoom?: number;
    id?: string;
    moveable?: boolean;
    style?: any;
}

export interface State {
    selectedBaseMap: MapLayer;
}

export class MapView extends React.Component<Props, State> {

    private mapDiv: string;
    private minZoom: number;
    private maxZoom: number;
    private style: any;

    constructor(props: Props) {
        let selectedBaseMap = props.selectedBaseMap;
        if (typeof selectedBaseMap === 'string' || selectedBaseMap instanceof String) {
            selectedBaseMap = { mapUrl: props.selectedBaseMap } as MapLayer;
        }
        super(props);
        this.state = {
            selectedBaseMap,
        };
        this.minZoom = this.props.minZoom || 0;
        this.maxZoom = this.props.maxZoom || 20;
        this.mapDiv = this.props.id || "ProviderMap";
        this.style = this.props.style
    }

    render() {
        return (
            <OlMapComponent
                style={{ ...this.style, height: '100%', width: '100%' }}
                divId={this.mapDiv}
                minZoom={this.props.minZoom}
                maxZoom={this.props.maxZoom}
                zoomLevel={this.props.zoom}
            >
                {Object.keys(this.props.geojson).length !== 0 && (
                    <OlFeatureLayer geojson={this.props.geojson} zIndex={99}>
                        <ZoomToAoi zoomLevel={this.props.zoom}/>
                    </OlFeatureLayer>
                )}
                <OlMouseWheelZoom enabled={false}/>
                <OlRasterTileLayer mapLayer={this.state.selectedBaseMap} copyright={this.props.copyright} zIndex={0}/>
            </OlMapComponent>
        );
    }
}
