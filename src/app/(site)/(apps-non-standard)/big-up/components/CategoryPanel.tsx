import {
  Box,
  Text,
  VStack,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Badge,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

type Category = {
  uniqueId: number;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
};

type Props = {
  category: Category;
  onUpdateCategory: (updated: Category) => void;
  customerId: number | null;
  toolId: number;
};

export default function CategoryPanel({
  category,
  onUpdateCategory,
}: Props) {
  const [editable, setEditable] = useState<Category>(category);
  const [hasChanges, setHasChanges] = useState(false);
  const toast = useToast();

  /* reset local copy whenever parent changes */
  useEffect(() => {
    setEditable(category);
    setHasChanges(false);
  }, [category]);

  /* tiny helper */
  const patch = <K extends keyof Category>(key: K, val: Category[K]) => {
    setEditable((p) => ({ ...p, [key]: val }));
    setHasChanges(true);
  };

  /* save */
  const save = async () => {
    try {
      const resp = await fetch('/api/bigup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editable),
      });
      if (!resp.ok) throw new Error('Save failed');
      onUpdateCategory(editable);
      setHasChanges(false);
      toast({ title: 'Changes saved', status: 'success', duration: 3000, isClosable: true });
    } catch (err: any) {
      toast({ title: err.message ?? 'Error', status: 'error', duration: 4000, isClosable: true });
    }
  };

  /* toggle active */
  const toggle = async (checked: boolean) => {
    patch('isActive', checked);
    await save(); // simple: reuse same endpoint
  };

  return (
    <Box p={4} border='1px solid' borderColor='gray.200' borderRadius='md' bg='white'>
      {/* header row */}
      <HStack mb={6} justify='space-between'>
        <Text fontSize={['lg', 'xl']} fontWeight='bold'>
          {editable.name}
        </Text>
        <HStack>
          <Badge colorScheme={editable.isActive ? 'green' : 'red'}>
            {editable.isActive ? 'Active' : 'Inactive'}
          </Badge>
          <Switch isChecked={editable.isActive} onChange={(e) => toggle(e.target.checked)} />
        </HStack>
      </HStack>

      <VStack align='stretch' spacing={4}>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            value={editable.name}
            onChange={(e) => patch('name', e.target.value)}
            isDisabled={!editable.isActive}
            variant='flushed'
          />
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          <Textarea
            value={editable.description}
            onChange={(e) => patch('description', e.target.value)}
            isDisabled={!editable.isActive}
            rows={3}
            variant='flushed'
          />
        </FormControl>

        <FormControl>
          <FormLabel>Points</FormLabel>
          <Input
            type='number'
            value={editable.points}
            onChange={(e) => patch('points', parseInt(e.target.value))}
            isDisabled={!editable.isActive}
            variant='flushed'
          />
        </FormControl>
      </VStack>

      <HStack justify='flex-end' mt={6}>
        <Button colorScheme='blue' isDisabled={!hasChanges || !editable.isActive} onClick={save}>
          Save
        </Button>
      </HStack>
    </Box>
  );
}
