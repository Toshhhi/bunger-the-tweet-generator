import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function AnimatedBird({ isReacting }) {
  const canvasRef = useRef(null);
  const birdRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.pixelRatio = window.devicePixelRatio;

    camera.position.z = 5;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      "/scene.gltf",
      (gltf) => {
        const bird = gltf.scene;
        bird.scale.set(2, 2, 2);
        scene.add(bird);
        birdRef.current = bird;
        console.log("Bird loaded successfully");
      },
      undefined,
      (error) => {
        console.error("Error loading bird model:", error);
      }
    );

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.016;

      if (birdRef.current) {
        // Flying path - smaller and faster
        birdRef.current.position.x = Math.sin(time * 1) * 3;
        birdRef.current.position.y = Math.cos(time * 0.7) * 2;
        birdRef.current.rotation.y = Math.sin(time * 1) * 0.3;

        // React to tweet
        if (isReacting) {
          birdRef.current.scale.set(
            1 + Math.sin(time * 15) * 0.1,
            1 + Math.sin(time * 15) * 0.1,
            1 + Math.sin(time * 15) * 0.1
          );
        } else {
          birdRef.current.scale.set(1, 1, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isReacting]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: "none" }}
    />
  );
}