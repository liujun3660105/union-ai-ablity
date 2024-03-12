import React, { useEffect, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import ChatClient from '@/components/chat/chat-client';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function index() {
  const mapRef = useRef<mapboxgl.Map>();
  const mapContainerRef = useRef<HTMLDivElement>();


  function onMapContainerSizeChange(){
    console.log(mapRef.current)
    mapRef.current?.resize()
  }
  function initMap() {
   
    mapRef.current = new mapboxgl.Map({
      container: "map_container", // container ID
      style: "mapbox://styles/mapbox/streets-v12", // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
    console.log(123,mapContainerRef)
    
    mapContainerRef.current?.addEventListener('resize',onMapContainerSizeChange)
  }

  function unInitMap(){
    mapContainerRef.current?.removeEventListener('resize',onMapContainerSizeChange)
  }

  useEffect(() => {
    initMap();

    return ()=>{
        unInitMap()
    }
  }, []);
  return (
    <div className="flex h-full gap-3">
      <div className="flex-none w-96 bg-base-300">
        <ChatClient/>
      </div>
      <div id="map_container" ref={mapContainerRef} className="flex-1 bg-base-300"></div>
    </div>
  );
}
