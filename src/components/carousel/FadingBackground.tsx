import React, { useState, useEffect } from "react"
import { Box } from "@chakra-ui/react"

interface BackgroundLayer {
  id: number
  image: string
  opacity: number
}

interface FadingBackgroundProps {
  images: string[]
  currentIndex: number
}

const FadingBackground: React.FC<FadingBackgroundProps> = ({
  images,
  currentIndex,
}) => {
  const [layers, setLayers] = useState<BackgroundLayer[]>([
    { id: 0, image: images[currentIndex], opacity: 1 },
  ])
  const [nextLayerId, setNextLayerId] = useState(1)

  useEffect(() => {
    const newLayer = {
      id: nextLayerId,
      image: images[currentIndex],
      opacity: 0,
    }
    setLayers([...layers, newLayer])
    setNextLayerId(nextLayerId + 1)

    setTimeout(() => {
      setLayers((prevLayers) =>
        prevLayers.map((layer, idx) => {
          if (idx === prevLayers.length - 1) {
            return { ...layer, opacity: 1 }
          }
          return { ...layer, opacity: 0 }
        }),
      )
    }, 10)

    setTimeout(() => {
      setLayers((prevLayers) => prevLayers.slice(1))
    }, 1000)
  }, [currentIndex])

  return (
    <>
      {layers.map((layer) => (
        <Box
          key={layer.id}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          backgroundImage={layer.image}
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
          backgroundSize="cover"
          opacity={layer.opacity}
          transition="opacity 1s"
        />
      ))}
    </>
  )
}

export default FadingBackground
