import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { Avatar } from '@shared/ui';
import { RootState } from '@store/store';
import { RootStackParamList } from '@app/navigation/types';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface UserAvatarProps {
  size?: number;
}

export function UserAvatar({ size = 40 }: UserAvatarProps) {
  const navigation = useNavigation<Nav>();
  const user = useSelector((state: RootState) => state.user.user);

  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('');

  return (
    <Pressable onPress={() => navigation.navigate('Progress')}>
      <Avatar initials={initials} size={size} hue={user.avatarHue} />
    </Pressable>
  );
}
