import { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { FilterChip } from '@shared/ui';

interface FilterRowProps {
  filters: string[];
  initial?: string;
  onChange?: (filter: string) => void;
}

export function FilterRow({ filters, initial, onChange }: FilterRowProps) {
  const [active, setActive] = useState(initial ?? filters[0]);
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {filters.map((filter) => (
        <FilterChip
          key={filter}
          label={filter}
          active={active === filter}
          onPress={() => {
            setActive(filter);
            onChange?.(filter);
          }}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
});
