import * as THREE from 'three'
import React, { Suspense, useRef, useState } from 'react'
import { Canvas, useFrame, useResource } from 'react-three-fiber'
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from 'react-postprocessing'
import { Html, Icosahedron, useTextureLoader, useCubeTextureLoader, MeshDistortMaterial } from 'drei'

function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
      <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} opacity={3} />
      <Noise opacity={0.02} />
      <Vignette eskil={false} offset={0.1} darkness={1.1} />
    </EffectComposer>
  )
}

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {
  const bumpMap = useTextureLoader('./bump.jpg')
  const envMap = useCubeTextureLoader(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png'], { path: 'cube/' })
  return (
    <MeshDistortMaterial
      ref={forwardedRef}
      color={'#010101'}
      roughness={0.1}
      metalness={1}
      envMap={envMap}
      bumpMap={bumpMap}
      bumpScale={0.0032}
      clearcoat={1}
      clearcoatRoughness={1}
      radius={1}
      distort={0.4}
    />
  )
})

function MainSphere({ material }) {
  const main = useRef()
  // main sphere rotates following the mouse position
  useFrame(({ clock, mouse }) => {
    main.current.rotation.z = clock.getElapsedTime()
    main.current.rotation.y = THREE.MathUtils.lerp(main.current.rotation.y, mouse.x * Math.PI, 0.1)
    main.current.rotation.x = THREE.MathUtils.lerp(main.current.rotation.x, mouse.y * Math.PI, 0.1)
  })
  return <Icosahedron args={[1, 4]} ref={main} material={material} position={[0, 0, 0]} />
}

function Instances({ material }) {
  // we use this array ref to store the spheres after creating them
  const [sphereRefs] = useState(() => [])
  // we use this array to initialize the background spheres
  const initialPositions = [
    [-4, 20, -12],
    [-10, 12, -8],
    [-11, -12, -23],
    [-16, -6, -10],
    [12, -2, -6],
    [13, 4, -12],
    [14, -2, -23],
    [8, 10, -20],
  ]
  // smaller spheres movement
  useFrame(() => {
    // animate each sphere in the array
    sphereRefs.forEach((el) => {
      el.position.y += 0.02
      if (el.position.y > 19) el.position.y = -18
      el.rotation.x += 0.06
      el.rotation.y += 0.06
      el.rotation.z += 0.02
    })
  })
  return (
    <>
      <MainSphere material={material} />
      {initialPositions.map((pos, i) => (
        <Icosahedron
          args={[1, 4]}
          position={[pos[0], pos[1], pos[2]]}
          material={material}
          key={i}
          ref={(ref) => (sphereRefs[i] = ref)}
        />
      ))}
    </>
  )
}

function Scene() {
  // We use `useResource` to be able to delay rendering the spheres until the material is ready
  const [matRef, material] = useResource()
  return (
    <>
      <ShaderMaterial ref={matRef} />
      {material && <Instances material={material} />}
    </>
  )
}

export default function App() {
  return (
    <Canvas
      colorManagement
      concurrent
      pixelRatio={1}
      camera={{ position: [0, 0, 3] }}
      gl={{ powerPreference: 'high-performance', alpha: false, antialias: false, stencil: false, depth: false }}>
      <color attach="background" args={['#050505']} />
      <fog color="#161616" attach="fog" near={8} far={30} />
      <Suspense fallback={<Html center>Loading.</Html>}>
        <Scene />
        <Effects />
      </Suspense>
    </Canvas>
  )
}
