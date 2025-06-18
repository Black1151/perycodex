import { useCallback, useEffect, useState, useMemo } from 'react';
import { Category as CategoryIcon, Lock } from '@mui/icons-material';
import {
  Box,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Badge,
} from '@chakra-ui/react';
import CategoryPanel from './CategoryPanel';
import SplitPaneModal from '@/components/modals/SplitPaneModal';

type Category = {
  uniqueId: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
};

export default function CategoriesModal(props: {
  isOpen: boolean;
  onClose: () => void;
  customerId: number | null;
  isFree: boolean;
  toolId: number;
}) {
  const { isOpen, onClose, customerId, isFree, toolId } = props;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]   = useState(false);
  const [error,   setError]     = useState<string | null>(null);
  const [selId,   setSelId]     = useState<number | null>(null);

  const selected = categories.find((c) => c.uniqueId === selId) ?? null;

  const fetchCats = useCallback(async () => {
    if (!customerId) return;
    setLoading(true); setError(null);
    try {
      const r = await fetch(`/api/bigup?customerId=${customerId}`);
      if (!r.ok) throw new Error('fetch failed');
      const j = await r.json();
      const mapped: Category[] = (j.resource ?? []).map((i: any) => ({
        uniqueId: i.id, name: i.name, description: i.description,
        points: i.points, isActive: i.isActive,
      }));
      setCategories(mapped);
      setSelId(mapped[0]?.uniqueId ?? null);
    } catch (e: any) { setError(e.message); }
    finally          { setLoading(false); }
  }, [customerId]);

  useEffect(() => { if (isOpen) fetchCats(); }, [isOpen, fetchCats]);

  const Sidebar = useMemo(() => {
    if (loading) return <Spinner size='lg' />;
    if (error)   return (
      <Alert status='error'><AlertIcon />{error}</Alert>
    );
    if (!categories.length) return (
      <Text textAlign='center' mt={10}>No categories.</Text>
    );

    return (
      <VStack align='stretch' spacing={4}>
        {categories.map((c) => {
          const locked = props.isFree && !c.isActive;
          return (
            <Box
              key={c.uniqueId}
              border='1px solid'
              borderColor={selId === c.uniqueId ? 'blue.400' : 'gray.200'}
              p={3}
              borderRadius='md'
              opacity={locked ? 0.5 : 1}
              _hover={{ cursor: locked ? 'not-allowed' : 'pointer', bg: 'gray.50' }}
              onClick={() => !locked && setSelId(c.uniqueId)}
            >
              {locked && <Lock fontSize='small' />}
              <Text fontWeight='semibold' mb={1}>{c.name}</Text>
              <Text fontSize='sm' noOfLines={2}>{c.description}</Text>
              <Badge mt={1} colorScheme='blue'>{c.points} pts</Badge>
            </Box>
          );
        })}
      </VStack>
    );
  }, [categories, selId, loading, error, props.isFree]);

  const Panel = selected ? (
    <CategoryPanel
      category={selected}
      onUpdateCategory={(u) =>
        setCategories((p) => p.map((c) => (c.uniqueId === u.uniqueId ? u : c)))
      }
      customerId={customerId}
      toolId={toolId}
    />
  ) : (
    <Text textAlign='center' mt={10}>No category selected</Text>
  );

  /* mobile selector items ---------------------------------------------- */
  const mobileItems = categories.map((c) => ({
    id: c.uniqueId,
    label: c.name,
    isActive: c.isActive,
  }));

  return (
    <SplitPaneModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<CategoryIcon fontSize='inherit' htmlColor='var(--chakra-colors-primary)' />}
      title='Manage Categories'
      total={categories.length}
      sidebar={Sidebar}
      panel={Panel}
      sidebarLoading={loading}
      sidebarSkeletonCount={4}
      mobileItems={mobileItems}
      mobileSelectedId={selId ?? undefined}
      onMobileSelect={(id) => setSelId(id as number)}
    />
  );
}
