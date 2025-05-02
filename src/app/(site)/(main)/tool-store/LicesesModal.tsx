import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  VStack,
  Text,
  useTheme,
  HStack,
  StackDivider,
  Tooltip,
  Box,
} from '@chakra-ui/react'
import { useBasketContext } from './BasketContext'

export interface LicensesModalProps {
  isOpen: boolean;
  onClose: (changeAmount?: number) => void;
}

export function LicensesModal({
  isOpen,
  onClose,
}: LicensesModalProps) {
  const theme = useTheme()
  const PRICE_PER_LICENSE = 10
  const {
    currentLicenses,
    currentActiveLicenses,
    decreaseCurrentLicenses,
    increaseCurrentLicenses,
    additionalLicenses,
  } = useBasketContext()

  const currentlyAvailableLicenses = currentLicenses - currentActiveLicenses
  const newLicenses = currentLicenses + additionalLicenses
  const newAvailable = newLicenses - currentActiveLicenses
  const [tempAmount, setTempAmount] = useState<number>(currentLicenses)

  useEffect(() => {
    if (isOpen) {
      setTempAmount(currentLicenses)
    }
  }, [isOpen, currentLicenses])

  const canDecrement = tempAmount - 20 >= currentActiveLicenses

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Manage Licenses</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} divider={<StackDivider borderColor="gray.200" />}>
            {/* Explanation */}
            <VStack spacing={1} align="start">
              <Text>
                You currently own <b>{currentLicenses}</b> licenses, of which{' '}
                <b>{currentActiveLicenses}</b> are in active use, leaving{' '}
                <b>{currentlyAvailableLicenses}</b> available seats.
              </Text>
            </VStack>

            {/* Current vs New */}
            {/* <HStack justify="space-between" w="100%">
              <Box flex="1" p={4} bg="gray.50" borderRadius="md">
                <Text fontSize="sm" color="gray.500">
                  Current
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  Owned: {currentLicenses}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Available: {currentActiveLicenses}
                </Text>
              </Box>
              <Box flex="1" p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="sm" color="blue.600">
                  New
                </Text>
                <Text fontSize="2xl" fontWeight="bold">
                  Owned: {newLicenses}
                </Text>
                <Text fontSize="sm" color="blue.600">
                  Available: {newAvailable}
                </Text>
              </Box>
            </HStack> */}

            {/* Summary of change */}
            {/* <Text>
              {deltaOwned === 0
                ? "No change in total licenses."
                : deltaOwned > 0
                ? `You’re adding ${deltaOwned} more licenses, giving ${deltaAvailable} extra available seats.`
                : `You’re removing ${-deltaOwned} licenses, reducing available seats by ${-deltaAvailable}.`}
            </Text> */}

            {/* +/− 20 controls */}
            <HStack spacing={4}>
              <Tooltip
                label="Cannot go below number of used licenses"
                isDisabled={canDecrement}
                placement="top"
                shouldWrapChildren
              >
                <Button
                  onClick={() =>
                    setTempAmount(prev => Math.max(prev - 20, currentActiveLicenses))
                  }
                  isDisabled={!canDecrement}
                >
                  −20
                </Button>
              </Tooltip>
              <Button onClick={() => setTempAmount(prev => prev + 20)}>
                +20
              </Button>
            </HStack>

            <VStack spacing={4} w="100%">
              <Text fontSize="lg" fontWeight="bold">
                New total licenses: {tempAmount}
              </Text>
              <Text fontSize="lg" fontWeight="bold">
                Adding a total of {tempAmount - currentLicenses} licenses
              </Text>
            </VStack>

          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => onClose(tempAmount - currentLicenses)} colorScheme="blue">
            Submit Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
