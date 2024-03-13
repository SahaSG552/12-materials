import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug

const gui = new dat.GUI()

// Canvas

const canvas = document.querySelector('canvas.webgl')

// Scene

const scene = new THREE.Scene()

/**
 * Base
 */

// Textures
const textureLoader = new THREE.TextureLoader()
textureLoader.onLoad = () => { console.log('LOAD') }
textureLoader.onStart = () => { console.log('START') }
textureLoader.onProgress = () => { console.log('PROGRESS') }

const cubeTextureLoader = new THREE.CubeTextureLoader()
const doorColorTexture = textureLoader.load('/static/textures/door/color.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/static/textures/door/ambientOcclusion.jpg')
const doorAlphaTexture = textureLoader.load('/static/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('/static/textures/door/height.jpg')
const doorMetallnessTexture = textureLoader.load('/static/textures/door/metallness.jpg')
const doorNormalTexture = textureLoader.load('/static/textures/door/normal.jpg')
const doorRoughnessTexture = textureLoader.load('/static/textures/door/roughness.jpg')
const doorMatCapTexture = textureLoader.load('/static/textures/matcaps/5.png')
const gradientTexture = textureLoader.load('/static/textures/gradients/5.jpg')

const enviromentMapTexture = cubeTextureLoader.load([
    'static/textures/environmentMaps/4/px.png',
    'static/textures/environmentMaps/4/nx.png',
    'static/textures/environmentMaps/4/py.png',
    'static/textures/environmentMaps/4/ny.png',
    'static/textures/environmentMaps/4/pz.png',
    'static/textures/environmentMaps/4/nz.png']
)


// const color = new THREE.Color(0x7cd10d) //#7cd10d
// const material = new THREE.MeshBasicMaterial()
// const material = new THREE.MeshNormalMaterial()
// const material = new THREE.MeshMatcapMaterial() // MatCap is material from gradient sphere texture
// material.matcap = doorMatCapTexture
// const material = new THREE.MeshDepthMaterial() // Lighter if camera is near
// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 1000
// material.specular = new THREE.Color(0x052529) //#052529

gradientTexture.minFilter = THREE.NearestFilter
gradientTexture.magFilter = THREE.NearestFilter
gradientTexture.generateMipmaps = true
// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture

const material = new THREE.MeshStandardMaterial()
material.metalness = 1
material.roughness = 0.1
// material.transparent = true
// material.opacity = 0.3
material.envMap = enviromentMapTexture


// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.aoMapIntensity = 2.5
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.02
// material.metalnessMap = doorMetallnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.8, 0.8)
// material.alphaMap = doorAlphaTexture
// material.transparent = true
// material.wireframe = true

gui
    .add(material, 'metalness')
    .min(0)
    .max(1)
    .step(0.001)

gui
    .add(material, 'roughness')
    .min(0)
    .max(1)
    .step(0.001)

gui
    .add(material, 'opacity')
    .min(0)
    .max(1)
    .step(0.001)
// gui
//     .add(material, 'aoMapIntensity')
//     .min(0)
//     .max(10)
//     .step(0.001)

// gui
//     .add(material, 'displacementScale')
//     .min(0)
//     .max(0.1)
//     .step(0.001)

// gui
//     .add(material, 'normalScale')
//     .min(0)
//     .max(0.1)
//     .step(0.001)
// material.transparent = true
// material.color.set(color)
// material.map = doorColorTexture
// material.alphaMap = doorAlphaTexture
// aterial.wireframe = true
// material.flatShading = true
material.side = THREE.DoubleSide

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material)
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.2, 64, 128), material)

console.log(plane.geometry.attributes.uv.array)
plane.geometry.setAttribute('uv2', new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2))
torus.geometry.setAttribute('uv2', new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2))
sphere.geometry.setAttribute('uv2', new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2))

scene.background = new THREE.Color(0x052529) //#052529
sphere.position.set(-1.5, 0, 0)
torus.position.set(1.5, 0, 0)
scene.add(sphere, plane, torus)

const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.01), material)
sphere2.position.set(0, 1, 1)
scene.add(sphere2)
// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 2)
pointLight.position.set(0, 1, 1)
scene.add(pointLight)

gui
    .add(pointLight, 'intensity')
    .min(0)
    .max(15)
    .step(1)
    .name('Light Intensity')

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // sphere.rotation.y = 0.1 * elapsedTime
    // plane.rotation.y = 0.1 * elapsedTime
    // torus.rotation.y = 0.1 * elapsedTime
    // sphere.rotation.x = 0.2 * elapsedTime
    // plane.rotation.x = 0.2 * elapsedTime
    // torus.rotation.x = 0.2 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()