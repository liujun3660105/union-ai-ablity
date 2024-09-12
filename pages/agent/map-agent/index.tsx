import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import ChatClient from '@/components/chat/chat-client';
import { wss } from '@/utils/ws';
import { LayoutWrapper as Layout } from '@/components/layout/root-layout';
import * as turf from '@turf/turf';
import type { ReactElement } from 'react';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const wsBaseUrl = process.env.WS_BASE_URL;

export default function Index() {
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>();
  const clientIdRef = useRef<string>(Math.random().toString(36).substring(7));
  console.log('clientIdRef', clientIdRef.current);

  function onReceiveMsg(res: Object) {
    const geojson = res as GeoJSON.FeatureCollection;
    // const geojson = JSON.parse(res);
    displayFeature(geojson);
  }

  useEffect(() => {
    wss.connect(`${wsBaseUrl}/api/v1/ws/${clientIdRef.current}`);
    // wss.send({ socketType: 'geojson' }); // 绑定主题
    wss.registerCallBack('geojson', onReceiveMsg);
    initMap();

    return () => {
      unInitMap();
    };
  }, []);

  function onMapContainerSizeChange() {
    mapRef.current?.resize();
  }
  function initMap() {
    mapRef.current = new mapboxgl.Map({
      container: 'map_container', // container ID
      // style: 'mapbox://styles/mapbox/streets-v12', // style URL
      style: {
        version: 8,
        sources: {
          'raster-tile': {
            type: 'raster',
            tiles: ['http://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'],
          },
        },
        layers: [
          {
            id: 'raster-tile',
            type: 'raster',
            source: 'raster-tile',
          },
        ],
      },
      center: [117.66743, 39.04844], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });

    mapContainerRef.current?.addEventListener('resize', onMapContainerSizeChange);
  }

  function unInitMap() {
    mapContainerRef.current?.removeEventListener('resize', onMapContainerSizeChange);
  }

  function addLayer(geojson: GeoJSON.Feature | GeoJSON.FeatureCollection) {
    debugger;
    let geometryType = '';
    let mapboxGeomType = '';
    if (geojson.type === 'Feature') {
      geometryType = geojson.geometry.type;
    }
    if (geojson.type === 'FeatureCollection') {
      const feature = geojson.features[0];
      geometryType = feature.geometry.type;
    }
    switch (geometryType) {
      case 'MultiPoint':
      case 'Point':
        mapRef.current?.addLayer({
          type: 'circle',
          source: 'feature-collection',
          id: 'point-feature',
          paint: {
            'circle-radius': 10,
            'circle-color': '#007cbf',
          },
        });
        break;
      case 'MultiLineString':
      case 'LineString':
        mapRef.current?.addLayer({
          type: 'line',
          source: 'feature-collection',
          id: 'line-feature',
          paint: {
            'line-color': 'red',
            'line-width': 3,
            'line-opacity': 0.8,
            // 'line-dasharray': [2, 4],
          },
        });
        break;
      case 'MultiPolygon':
      case 'Polygon':
        mapboxGeomType = 'fill';
        mapRef.current?.addLayer({
          type: 'fill',
          source: 'feature-collection',
          id: 'polygon-feature',
          paint: {},
        });
        break;
    }
  }

  function displayFeature(geojson: GeoJSON.FeatureCollection) {
    debugger;
    mapRef.current?.getLayer('point-feature') && mapRef.current?.removeLayer('point-feature');
    mapRef.current?.getLayer('line-feature') && mapRef.current?.removeLayer('line-feature');
    mapRef.current?.getLayer('polygon-feature') && mapRef.current?.removeLayer('polygon-feature');
    mapRef.current?.getSource('feature-collection') && mapRef.current?.removeSource('feature-collection');
    const bbox = turf.bbox(geojson);
    const mapboxBbox = [
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ];
    mapRef.current?.fitBounds(mapboxBbox, {
      padding: { top: 10, bottom: 25, left: 15, right: 5 },
    });
    // mapRef.current?.fitBounds(bbox)
    mapRef.current?.addSource('feature-collection', {
      type: 'geojson',
      data: geojson,
    });
    addLayer(geojson);
  }

  const handleRecieveMessage = (msg: string) => {
    // console.log('🚀 ~ handleRecieveMessage ~ msg:', msg);
    // // msg中可能包含了geojson数据
    // debugger;
    // const geojson = extractPotentialGeojson(msg);
    // if (geojson) {
    //   displayFeature(geojson);
    // } else {
    // }
  };

  return (
    <div className="flex h-full gap-3">
      <div className="flex-none w-96 bg-base-300">
        <ChatClient callback={handleRecieveMessage} clientId={clientIdRef.current} />
      </div>
      <div id="map_container" ref={mapContainerRef} className="flex-1 bg-base-300" />
    </div>
  );
}

Index.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
