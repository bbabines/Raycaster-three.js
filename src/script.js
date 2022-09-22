import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const object1 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
	new THREE.SphereGeometry(0.5, 16, 16),
	new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// Raycaster
const raycaster = new THREE.Raycaster();

// // Setting the start of the raycaster
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// // Setting the direction of the raycaster
// const rayDirection = new THREE.Vector3(10, 0, 0);
// // This sets the vector to the same direction but sets the length to 1. You can set the first argument to 1 but if it's changed later and not normalized, it won't work. 1. ALWAYS NORMALIZE THE RAY DIRECTION ! !
// rayDirection.normalize();

// // This CREATES the ray
// raycaster.set(rayOrigin, rayDirection);

// // This "casts" the ray on one object
// const intersect = raycaster.intersectObject(object2);

// // This "casts" the ray on all three objects
// const intersects = raycaster.intersectObjects([object1, object2, object3]);

/**
 * Sizes
 */
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

window.addEventListener("resize", () => {
	// Update sizes
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;

	// Update camera
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();

	// Update renderer
	renderer.setSize(sizes.width, sizes.height);
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Mouse: Using Vector2 to get coordinates of mouse location
const mouse = new THREE.Vector2();

window.addEventListener("click", () => {
	if (currentIntersect) {
		switch (currentIntersect.object) {
			case object1:
				console.log("click on object 1");
				break;

			case object2:
				console.log("click on object 2");
				break;

			case object3:
				console.log("click on object 3");
				break;
		}
	}
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
	75,
	sizes.width / sizes.height,
	0.1,
	100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
	canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
	const elapsedTime = clock.getElapsedTime();

	// Animate object
	object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
	object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
	object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

	// //Ray Origin
	// const rayOrigin = new THREE.Vector3(-3, 0, 0);

	// // Ray Direction
	// const rayDirection = new THREE.Vector3(1, 0, 0);
	// // Normalize
	// rayDirection.normalize();

	// // Raycaster set
	// raycaster.set(rayOrigin, rayDirection);

	// // Shoot the ray
	const objectsToTest = [object1, object2, object3];
	const intersects = raycaster.intersectObjects(objectsToTest);

	for (const object of objectsToTest) {
		object.material.color.set("#ff0000");
	}

	for (const intersect of intersects) {
		intersect.object.material.color.set("#0000ff");
	}

	//
	//

	// Cast a ray with .setFromCamera by using the mouse event listener and camera as arguments.
	raycaster.setFromCamera(mouse, camera);

	// Create a "witness" to declare your mouse is hovering over an object
	let currentIntersect = null;

	if (intersects.length) {
		if (currentIntersect === null) {
			console.log("mouse enter");
		}
		currentIntersect = intersects[0];
	} else {
		if (currentIntersect) {
			console.log("mouse leave");
		}
		currentIntersect = null;
	}

	//
	//

	// Update controls
	controls.update();

	// Render
	renderer.render(scene, camera);

	// Call tick again on the next frame
	window.requestAnimationFrame(tick);
};

tick();
