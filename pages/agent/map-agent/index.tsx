import React, { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import ChatClient from '@/components/chat/chat-client';
import { extractPotentialGeojson } from '@/utils/data-handle';
import * as turf from '@turf/turf';
import { display } from '@mui/system';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function Index() {
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>();
  useEffect(() => {
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
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [117.66743, 39.04844], // starting position [lng, lat]
      zoom: 12, // starting zoom
    });
    // mapRef.current.on('styledata', () => {
    //   displayFeature();
    // });

    mapContainerRef.current?.addEventListener('resize', onMapContainerSizeChange);
  }

  function unInitMap() {
    mapContainerRef.current?.removeEventListener('resize', onMapContainerSizeChange);
  }

  function addLayer(geojson: GeoJSON.Feature | GeoJSON.FeatureCollection) {
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
      case 'MultiPoint' || 'Point':
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
      case 'MultiLineString' || 'LineString':
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
      case 'MultiPolygon' || 'Polygon':
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
    // const test_data = {
    //   type: 'FeatureCollection',
    //   features: [
    //     {
    //       type: 'Feature',
    //       properties: { id: 5034 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667093, 39.017601],
    //             [117.666914, 39.01809],
    //             [117.666676, 39.018565],
    //             [117.666382, 39.01902],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5035 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.666382, 39.01902],
    //             [117.664413, 39.021741],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5037 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.665832, 39.019812],
    //             [117.665805, 39.019817],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5040 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.664434, 39.020077],
    //             [117.661464, 39.020642],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5147 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.664434, 39.020077],
    //             [117.664719, 39.020033],
    //             [117.665007, 39.020008],
    //             [117.665297, 39.020001],
    //             [117.665587, 39.020013],
    //             [117.665874, 39.020044],
    //             [117.666158, 39.020094],
    //             [117.666434, 39.020162],
    //             [117.666703, 39.020248],
    //             [117.666961, 39.020351],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5150 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.674171, 39.022256],
    //             [117.673263, 39.02224],
    //             [117.672361, 39.02216],
    //             [117.671471, 39.022018],
    //             [117.670602, 39.021814],
    //             [117.669759, 39.021551],
    //             [117.668949, 39.02123],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5151 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.668949, 39.02123],
    //             [117.666961, 39.020351],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5161 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.673423, 39.020649],
    //             [117.67369, 39.020076],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5162 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.673864, 39.019635],
    //             [117.673813, 39.019783],
    //             [117.673755, 39.01993],
    //             [117.67369, 39.020076],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5165 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.675505, 39.014556],
    //             [117.673864, 39.019635],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5274 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.664434, 39.020077],
    //             [117.666934, 39.019602],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5275 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667904, 39.014909],
    //             [117.667, 39.014731],
    //             [117.666601, 39.014667],
    //             [117.666197, 39.014631],
    //             [117.665791, 39.014623],
    //             [117.665385, 39.014642],
    //             [117.664983, 39.014689],
    //             [117.664588, 39.014764],
    //             [117.664202, 39.014865],
    //             [117.66383, 39.014993],
    //             [117.663473, 39.015145],
    //             [117.663135, 39.015322],
    //             [117.663062, 39.015359],
    //             [117.662989, 39.015397],
    //             [117.662917, 39.015435],
    //             [117.660238, 39.016858],
    //             [117.659747, 39.017134],
    //             [117.659275, 39.017429],
    //             [117.658823, 39.017744],
    //             [117.65732, 39.018848],
    //             [117.657213, 39.01892],
    //             [117.657099, 39.018985],
    //             [117.656979, 39.019042],
    //             [117.656854, 39.019092],
    //             [117.656723, 39.019134],
    //             [117.656589, 39.019167],
    //             [117.656452, 39.019192],
    //             [117.655636, 39.019311],
    //             [117.655386, 39.019351],
    //             [117.655136, 39.019397],
    //             [117.654889, 39.019449],
    //             [117.653578, 39.019744],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5354 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.666934, 39.019602],
    //             [117.667391, 39.019531],
    //             [117.667855, 39.019488],
    //             [117.668321, 39.019474],
    //             [117.668786, 39.01949],
    //             [117.669249, 39.019536],
    //             [117.669706, 39.01961],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5355 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.669706, 39.01961],
    //             [117.677556, 39.021146],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5358 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667397, 39.023354],
    //             [117.667325, 39.02312],
    //             [117.66728, 39.022882],
    //             [117.667262, 39.022642],
    //             [117.667272, 39.022402],
    //             [117.667308, 39.022163],
    //             [117.667372, 39.021928],
    //             [117.667463, 39.021698],
    //             [117.667579, 39.021475],
    //             [117.667721, 39.021261],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5359 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667721, 39.021261],
    //             [117.669662, 39.018619],
    //             [117.669807, 39.0184],
    //             [117.669925, 39.018172],
    //             [117.670016, 39.017936],
    //             [117.671845, 39.012278],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5363 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667904, 39.014909],
    //             [117.667902, 39.014909],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5476 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.663261, 39.015252],
    //             [117.66341, 39.015461],
    //             [117.66355, 39.015674],
    //             [117.663682, 39.01589],
    //             [117.664534, 39.017357],
    //             [117.664653, 39.017589],
    //             [117.664744, 39.017829],
    //             [117.664806, 39.018075],
    //             [117.664839, 39.018324],
    //             [117.664841, 39.018574],
    //             [117.664772, 39.020013],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5477 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.663906, 39.013083],
    //             [117.665695, 39.016043],
    //             [117.665778, 39.016199],
    //             [117.665842, 39.016361],
    //             [117.665887, 39.016527],
    //             [117.665911, 39.016695],
    //             [117.665914, 39.016865],
    //             [117.665884, 39.017651],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5478 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.666398, 39.012126],
    //             [117.66676, 39.013347],
    //             [117.666773, 39.013405],
    //             [117.66678, 39.013465],
    //             [117.666779, 39.013524],
    //             [117.666771, 39.013583],
    //             [117.666562, 39.014663],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5490 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.666988, 39.017907],
    //             [117.665965, 39.017664],
    //             [117.665779, 39.017626],
    //             [117.66559, 39.017601],
    //             [117.665398, 39.017588],
    //             [117.665206, 39.017587],
    //             [117.665015, 39.017599],
    //             [117.664825, 39.017623],
    //             [117.664639, 39.01766],
    //             [117.664457, 39.017708],
    //             [117.661108, 39.018723],
    //             [117.66096, 39.018774],
    //             [117.660819, 39.018836],
    //             [117.660686, 39.018907],
    //             [117.660562, 39.018988],
    //             [117.657109, 39.021469],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5687 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.671519, 39.017691],
    //             [117.671552, 39.017606],
    //             [117.671593, 39.017523],
    //             [117.671642, 39.017444],
    //             [117.6717, 39.017367],
    //             [117.671766, 39.017295],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 5696 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.677891, 39.020109],
    //             [117.66896, 39.018353],
    //             [117.668599, 39.01828],
    //             [117.668241, 39.018202],
    //             [117.667883, 39.018119],
    //             [117.66698, 39.017905],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 6121 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.671766, 39.017295],
    //             [117.673113, 39.015934],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 6482 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667902, 39.014909],
    //             [117.678312, 39.016956],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 6485 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667904, 39.014909],
    //             [117.667093, 39.017601],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 6487 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.667904, 39.014909],
    //             [117.668056, 39.014406],
    //             [117.668119, 39.01421],
    //             [117.668189, 39.014016],
    //             [117.668266, 39.013823],
    //             [117.668801, 39.012541],
    //             [117.668864, 39.012386],
    //             [117.668923, 39.01223],
    //             [117.668979, 39.012073],
    //             [117.669577, 39.010324],
    //             [117.66964, 39.010155],
    //             [117.669711, 39.009987],
    //             [117.66979, 39.009822],
    //             [117.669966, 39.009477],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 8218 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.670221, 39.021704],
    //             [117.671144, 39.018852],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 8219 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.671087, 39.019028],
    //             [117.671519, 39.017691],
    //           ],
    //         ],
    //       },
    //     },
    //     {
    //       type: 'Feature',
    //       properties: { id: 8293 },
    //       geometry: {
    //         type: 'MultiLineString',
    //         coordinates: [
    //           [
    //             [117.66743, 39.016483],
    //             [117.67991, 39.018938],
    //           ],
    //         ],
    //       },
    //     },
    //   ],
    // };
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
    console.log('🚀 ~ handleRecieveMessage ~ msg:', msg);
    // msg中可能包含了geojson数据
    debugger;
    const geojson = extractPotentialGeojson(msg);
    if (geojson) {
      displayFeature(geojson);
    } else {
    }
  };

  return (
    <div className="flex h-full gap-3">
      <div className="flex-none w-96 bg-base-300">
        <ChatClient callback={handleRecieveMessage} />
      </div>
      <div id="map_container" ref={mapContainerRef} className="flex-1 bg-base-300"></div>
    </div>
  );
}
