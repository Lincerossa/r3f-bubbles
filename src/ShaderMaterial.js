import * as THREE from 'three'
import React, { useRef, useEffect } from 'react'
import mergeRefs from 'merge-refs'
import { useLoader, useFrame } from 'react-three-fiber'
import { useControl } from 'react-three-gui'

import './materials/DistortMaterial'

const MATERIAL_GROUP = 'Material'
const SHADER_GROUP = 'Shader'

const ShaderMaterial = React.forwardRef(function ShaderMaterial(props, forwardedRef) {
  const matRef = useRef()

  // material settings
  const color = useControl('color', { group: MATERIAL_GROUP, type: 'color', value: '#010101' })
  const roughness = useControl('roughness', { group: MATERIAL_GROUP, type: 'number', value: 0.1, max: 1 })
  const metalness = useControl('metalness', { group: MATERIAL_GROUP, type: 'number', value: 1, max: 1 })
  const reflectivity = useControl('reflectivity', { group: MATERIAL_GROUP, type: 'number' })
  const clearcoat = useControl('clearcoat', { group: MATERIAL_GROUP, type: 'number', value: 1, max: 1 })
  const clearcoatRoughness = useControl('clearcoat roughness', {
    group: MATERIAL_GROUP,
    type: 'number',
    value: 1,
    max: 1,
  })
  const bumpScale = useControl('bump scale', {
    group: MATERIAL_GROUP,
    type: 'number',
    value: 0.001,
    step: 0.001,
    max: 1,
  })

  // shader settings
  const radius = useControl('radius', { group: SHADER_GROUP, type: 'number', value: 1, max: 1 })
  const distort = useControl('distort', { group: SHADER_GROUP, type: 'number', value: 0.4, max: 1 })

  const bumpMap = useLoader(THREE.TextureLoader, './bump.jpg')
  const [envMap] = useLoader(
    THREE.CubeTextureLoader,
    [['1.jpg', '2.jpg', '6.jpg', '4.jpg', '5.jpg', '3.jpg']],
    (loader) => loader.setPath('cube/')
  )

  useEffect(() => {
    matRef.current.envMap = envMap
  }, [envMap])

  // For some reason the envmap looks different if applied later-on
  useEffect(() => void (matRef.current.envMap = envMap), [envMap])

  useFrame((state) => {
    matRef.current.time = state.clock.getElapsedTime()
    matRef.current.radius = radius
    matRef.current.distort = distort
  })

  return (
    <distortMaterial
      ref={mergeRefs(forwardedRef, matRef)}
      color={color}
      roughness={roughness}
      metalness={metalness}
      bumpMap={bumpMap}
      bumpScale={bumpScale}
      reflectivity={reflectivity}
      clearcoat={clearcoat}
      clearcoatRoughness={clearcoatRoughness}
    />
  )
})

export default ShaderMaterial
