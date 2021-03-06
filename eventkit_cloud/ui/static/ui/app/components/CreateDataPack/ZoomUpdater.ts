import React, { useEffect, useRef } from 'react';
import { useOlZoom } from '../MapTools/context/OpenLayersContext';

interface Props {
    setZoom: (minZoom: number, maxZoom: number) => void;
}

function ZoomUpdater(props: Props) {
    const zoomContext = useOlZoom();
    const initialRender = useRef(true);
    useEffect(() => {
        if (!initialRender.current) {
            props.setZoom(null, zoomContext.zoomLevel);
        }
        initialRender.current = false;
    }, [zoomContext.zoomLevel]);

    return null;
}

export default ZoomUpdater;
