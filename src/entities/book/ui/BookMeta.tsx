import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, fontFamily } from '@shared/theme';
import { Tag } from '@shared/ui';
import { Book } from '../model/types';

interface BookMetaProps {
  book: Book;
  align?: 'left' | 'center';
  style?: ViewStyle;
}

export function BookMeta({ book, align = 'left', style }: BookMetaProps) {
  const isCenter = align === 'center';
  return (
    <View style={[styles.wrap, isCenter && styles.center, style]}>
      <Text style={[styles.title, isCenter && styles.textCenter]}>{book.title}</Text>
      <Text style={[styles.author, isCenter && styles.textCenter]}>by {book.author}</Text>
      <View style={[styles.tagsRow, isCenter && styles.center]}>
        {book.tags.map((t, i) => (
          <Tag key={t} label={t} variant={i === 0 || isCenter ? 'accent' : 'muted'} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  center: {
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.fontPrimary,
  },
  author: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: colors.fontSecondary,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
