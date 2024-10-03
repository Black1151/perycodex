import { Box } from "@chakra-ui/react"

interface DotProps {
  isActive: boolean
  onClick: () => void
}

const Dot: React.FC<DotProps> = ({ isActive, onClick }) => (
  <Box
    w={2}
    h={2}
    borderRadius="full"
    bg={isActive ? "white" : "black"}
    cursor="pointer"
    onClick={onClick}
  />
)

export default Dot
