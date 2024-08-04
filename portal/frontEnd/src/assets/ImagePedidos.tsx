import React from 'react'
import Lottie from 'lottie-react'
import AnimationLeaf from './pedidos.json'

const ImagePedidosAnimeted = () => (
  <Lottie
    style={{ width: 'auto', height: '100px', margin: 0, padding: 0 }}
    animationData={AnimationLeaf}
    loop={true}
  />
)
export default ImagePedidosAnimeted
