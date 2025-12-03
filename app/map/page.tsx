'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import styles from './map.module.css';
import { api, Location, ThemeImage } from '@/app/lib/apiHelper';
import nextcloudLoader from '../lib/nextCloudLoader';
import Image from 'next/image';

/* -------------------------------------------------------------------------- */
/* 🎯 Utility Functions                                                       */
/* -------------------------------------------------------------------------- */
const latLngToVector3 = (lat: number, lng: number, radius: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
};

const vector3ToLatLng = (vector: THREE.Vector3) => {
  const r = Math.sqrt(vector.x ** 2 + vector.y ** 2 + vector.z ** 2);
  const lat = -((Math.acos(vector.y / r) * 180) / Math.PI - 90);
  let lng = -((Math.atan2(vector.z, vector.x) * 180) / Math.PI - 180);

  if (lng > 180) lng -= 360;
  if (lng < -180) lng += 360;

  return { lat, lng };
};

/* -------------------------------------------------------------------------- */
/* 🌍 Globe Component                                                         */
/* -------------------------------------------------------------------------- */
const Globe = ({
  scale,
  locations,
  onPinClick,
}: {
  scale: number;
  locations: Location[];
  onPinClick: (location: Location, event: MouseEvent) => void;
}) => {
  const texture = useLoader(
    THREE.TextureLoader,
    'land_ocean_ice_cloud_2048.jpg'
  );
  const radius = 2;

  return (
    <>
      <mesh scale={[scale, scale, scale]}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshPhongMaterial map={texture} specular={new THREE.Color('grey')} shininess={8} />
      </mesh>

      {locations.map((location) => {
        const position = latLngToVector3(
          Number(location.latitude),
          Number(location.longitude),
          radius + 0.05
        );

        return (
          <mesh
            key={location.id}
            position={position.clone().multiplyScalar(scale)}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(location, e.nativeEvent);
            }}
          >
            <sphereGeometry args={[0.05 * scale, 16, 16]} />
            <meshBasicMaterial color="red" />
          </mesh>
        );
      })}
    </>
  );
};

/* -------------------------------------------------------------------------- */
/* 🎥 Camera Tracker                                                         */
/* -------------------------------------------------------------------------- */
const CameraTracker = ({
  targetPosition,
  onReachedTarget,
}: {
  targetPosition: THREE.Vector3 | null;
  onReachedTarget: () => void;
}) => {
  const { camera } = useThree();

  useFrame((_, delta) => {
    if (!targetPosition) return;
    const step = 2 * delta;
    camera.position.lerp(targetPosition, step);
    camera.lookAt(0, 0, 0);

    if (camera.position.distanceTo(targetPosition) < 0.01) {
      onReachedTarget();
    }
  });

  return null;
};

/* -------------------------------------------------------------------------- */
/* 📍 Center Tracker                                                          */
/* -------------------------------------------------------------------------- */
const CenterTracker = ({ onChange }: { onChange: (lat: number, lng: number) => void }) => {
  const { camera } = useThree();
  const last = useRef({ lat: 0, lng: 0 });

  useFrame(() => {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const radius = 2;
    const centerPoint = dir.clone().multiplyScalar(radius);
    const { lat, lng } = vector3ToLatLng(centerPoint);

    if (Math.abs(lat - last.current.lat) > 0.01 || Math.abs(lng - last.current.lng) > 0.01) {
      last.current = { lat, lng };
      onChange(lat, lng);
    }
  });

  return null;
};

/* -------------------------------------------------------------------------- */
/* 🧭 Globe Scene (Main Component)                                            */
/* -------------------------------------------------------------------------- */
const GlobeScene = () => {
  const [scale, setScale] = useState(1);
  const [selectedPin, setSelectedPin] = useState<Location | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [targetPosition, setTargetPosition] = useState<THREE.Vector3 | null>(null);
  const [centerCoords, setCenterCoords] = useState({ lat: 0, lng: 0 });
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationImages, setLocationImages] = useState<ThemeImage[]>([]);
  const controlsRef = useRef<any>(null);

  /* --- Night Mode --- */
  useEffect(() => {
    document.body.classList.add('dark');
    return () => document.body.classList.remove('dark');
  }, []);

  /* --- Fetch Locations --- */
  useEffect(() => {
    api.fetchLocations()
      .then(setLocations)
      .catch((err) => console.error('Failed to load locations:', err));
  }, []);

  /* --- Global Click Closes Modal --- */
  useEffect(() => {
    const handleClick = () => {
      setSelectedPin(null);
      setModalVisible(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  /* --- Pin Click --- */
  const handlePinClick = async (location: Location, event: MouseEvent) => {
    event.stopPropagation();

    // Toggle off if same pin clicked again
    if (selectedPin?.id === location.id && modalVisible) {
      setSelectedPin(null);
      setModalVisible(false);
      setLocationImages([]);
      return;
    }

    const newPos = latLngToVector3(Number(location.latitude), Number(location.longitude), 5);
    setSelectedPin(location);
    setTargetPosition(newPos);
    setModalVisible(false);

    if (controlsRef.current) controlsRef.current.enabled = false;

    try {
      const images = await api.fetchLocationImages(location.id);
      setLocationImages(images || []);
    } catch (err) {
      console.error('Failed to fetch location images:', err);
      setLocationImages([]);
    }
  };

  /* --- When Camera Arrives at Target --- */
  const handleTargetReached = () => {
    setTargetPosition(null);
    setModalVisible(true);
    if (controlsRef.current) controlsRef.current.enabled = true;
  };

  /* --- Zoom Handling --- */
  const handleWheel = (e: React.WheelEvent) => {
    setScale((prev) => Math.min(Math.max(prev - e.deltaY * 0.001, 0.5), 2));
  };

  return (
    <div className={styles.container} onWheel={handleWheel}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <Stars radius={100} depth={50} count={5000} factor={4} />

        <Suspense fallback={null}>
          <Globe scale={scale} locations={locations} onPinClick={handlePinClick} />
        </Suspense>

        <OrbitControls ref={controlsRef} enableZoom={false} />
        <CameraTracker targetPosition={targetPosition} onReachedTarget={handleTargetReached} />
        <CenterTracker onChange={(lat, lng) => setCenterCoords({ lat, lng })} />
      </Canvas>

      {/* --- Location Modal --- */}
      {modalVisible && selectedPin && (
        <div className={`${styles.sideModal} ${modalVisible ? styles.show : ''}`}>
          <div className={styles.sideModalHeader}>
            <h2>{selectedPin.name}</h2>
            <button
              className={styles.closeBtn}
              onClick={() => {
                setModalVisible(false);
                setSelectedPin(null);
              }}
            >
              ✕
            </button>
          </div>

          {locationImages.length > 0 ? (
            <div className={styles.imageGrid}>
              {locationImages.map((img) => (
                <Image
                  key={img.id}
                  loader={nextcloudLoader}
                  src={img.fileUrl}
                  alt={img.fileUrl}
                  width={100}
                  height={100}
                  className={styles.imageItem}
                />
              ))}
            </div>
          ) : (
            <p className={styles.noImages}>No images available.</p>
          )}
        </div>
      )}

      {/* --- Coordinates Display --- */}
      <div className={styles.coordDisplay}>
        <span>Lat: {centerCoords.lat.toFixed(4)}</span>
        <span>Lng: {centerCoords.lng.toFixed(4)}</span>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(GlobeScene), { ssr: false });
