import React from "react"
import { Box } from "@chakra-ui/react"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"

interface CarouselNavigationButtonProps {
  direction: "left" | "right"
  onClick: () => void
  top: string | undefined
  side: string | undefined
}

const CarouselNavigationButton: React.FC<CarouselNavigationButtonProps> = ({
  direction,
  onClick,
  top,
  side,
}) => {
  const IconComponent = direction === "left" ? ChevronLeft : ChevronRight

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    ;(e.currentTarget as HTMLElement).style.transform = "scale(1.2)"
  }

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    ;(e.currentTarget as HTMLElement).style.transform = "translateY(-25%)"
  }

  return (
    <Box
      aria-label={`${direction}-arrow`}
      position="absolute"
      left={direction === "left" ? side : undefined}
      right={direction === "right" ? side : undefined}
      top={top}
      zIndex={5}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="40px"
      height="40px"
      borderRadius="full"
      backgroundColor="rgba(0, 0, 0, 0.5)"
      transition="background-color 0.3s, transform 0.3s"
      transform="translateY(-25%)"
      cursor="pointer"
      _hover={{
        backgroundColor: "black",
      }}
    >
      <IconComponent
        style={{ color: "white", fontSize: "24px", transition: "color 0.3s" }}
      />
    </Box>
  )
}

export default CarouselNavigationButton
