import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    HStack,
    Text,
    Box,
    VStack,
    useBreakpointValue,
    useTheme,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Icon,
    Skeleton,
    SkeletonText,
    chakra,
  } from '@chakra-ui/react';
  import {
    KeyboardArrowDown,
    Check,
    Close as CloseIcon,
  } from '@mui/icons-material';
  import { ReactNode } from 'react';
  import { motion, Transition } from 'framer-motion';
  
  type MobileSelectorItem = {
    id: string | number;
    label: string;
    isActive?: boolean;
  };
  
  type Props = {
    isOpen: boolean;
    onClose: () => void;
  
    icon: ReactNode;
    title: string;
    total?: number;
  
    sidebar: ReactNode;
    panel: ReactNode;
  
    mobileItems?: MobileSelectorItem[];
    mobileSelectedId?: string | number;
    onMobileSelect?: (id: string | number) => void;
  
    sidebarLoading?: boolean;
    sidebarSkeletonCount?: number;
  
    contentMaxW?: string;
    contentMaxH?: string;
    contentMinH?: string;
  };
  
  const MotionOverlay = chakra(motion.div);
  const MotionContent = chakra(motion.div);
  
  const overlayTransition: Transition = { duration: 0.2, ease: 'easeOut' };
  const contentTransition: Transition = { type: 'spring', stiffness: 300, damping: 30 };
  
  export default function SplitPaneModal({
    isOpen,
    onClose,
    icon,
    title,
    total,
    sidebar,
    panel,
    mobileItems,
    mobileSelectedId,
    onMobileSelect,
    sidebarLoading = false,
    sidebarSkeletonCount = 6,
    contentMaxW = '1200px',
    contentMaxH = '85vh',
    contentMinH = '500px',
  }: Props) {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const theme = useTheme();
    const bg = theme.colors.elementBG;
  
    const SkeletonSidebar = () => (
      <VStack align='stretch' spacing={4}>
        {Array.from({ length: sidebarSkeletonCount }).map((_, i) => (
          <Box key={i} border='1px solid' borderColor='gray.200' borderRadius='md' p={3}>
            <Skeleton h='20px' mb={2} />
            <SkeletonText noOfLines={2} spacing='2' skeletonHeight='14px' />
          </Box>
        ))}
      </VStack>
    );
  
    const renderMobileSelector = () => {
      if (!mobileItems?.length || !onMobileSelect) return null;
      const sel = mobileItems.find((i) => i.id === mobileSelectedId);
  
      return (
        <Box mb={4}>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<KeyboardArrowDown />}
              width='100%'
              bg={theme.colors.elementBG}
            >
              <HStack spacing={2} w='100%' justifyContent='space-between'>
                <Text flex='1' textAlign='left' isTruncated>
                  {sel?.label ?? 'Select…'}
                </Text>
                {sel ? (
                  sel.isActive ? <Icon as={Check} color='green.500' /> : <Icon as={CloseIcon} color='red.500' />
                ) : null}
              </HStack>
            </MenuButton>
            <MenuList w='100%'>
              {mobileItems.map((it) => (
                <MenuItem key={it.id} onClick={() => onMobileSelect(it.id)}>
                  <HStack w='100%' justifyContent='space-between'>
                    <Text flex='1' textAlign='left' isTruncated>
                      {it.label}
                    </Text>
                    {it.isActive ? <Icon as={Check} color='green.500' /> : <Icon as={CloseIcon} color='red.500' />}
                  </HStack>
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>
      );
    };
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size='5xl' isCentered motionPreset='none'>
        {/* overlay */}
        <ModalOverlay
          as={MotionOverlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={overlayTransition as any}
          backdropFilter='blur(4px)'
        />
  
        {/* content */}
        <ModalContent
          as={MotionContent}
          initial={{ scale: 0, rotate: 12.5, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 0, opacity: 0 }}
          transition={contentTransition as any}
          maxW={['90vw', null, null, contentMaxW]}
          maxH={contentMaxH}
          minH={contentMinH}
          borderRadius='md'
          overflow='hidden'
        >
          <ModalCloseButton />
  
          <ModalBody p={0} bg={bg} display='flex' flexDirection='column' flex='1' minH='0'>
            {/* header */}
            <HStack
              px={4}
              py={3}
              bg={bg}
              borderBottom='1px solid'
              borderColor='gray.200'
              fontSize='28px'
              align='center'
            >
              {icon}
              <Text fontSize={['xl', '2xl', '3xl']} fontWeight='medium' fontFamily='bonfire' mb={-3}>
                {title}
              </Text>
              {total !== undefined && !isMobile && (
                <Text fontSize='sm' color='gray.500' ml={2}>
                  {total} total
                </Text>
              )}
            </HStack>
  
            {/* split panes */}
            <Box display='flex' flex='1' overflow='hidden' minH='0'>
              {/* desktop sidebar */}
              {!isMobile && (
                <Box
                  width='30%'
                  overflowY='auto'
                  minH='0'
                  borderRight='1px solid'
                  borderColor='gray.200'
                  p={4}
                  css={{
                    '&::-webkit-scrollbar': { display: 'none' },
                    '-ms-overflow-style': 'none',
                    scrollbarWidth: 'none',
                  }}
                >
                  {sidebarLoading ? <SkeletonSidebar /> : sidebar}
                </Box>
              )}
  
              {/* main panel */}
              <Box width={isMobile ? '100%' : '70%'} p={4} bg='gray.200' overflowY='auto'>
                {sidebarLoading ? null : (
                  <>
                    {isMobile && renderMobileSelector()}
                    {panel}
                  </>
                )}
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }
  