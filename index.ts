import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './src/app';

async function bootstrap() {
  if (__DEV__ && process.env.EXPO_PUBLIC_MOCK_API === 'true') {
    const { enableMocking } = await import('./src/mocks');
    await enableMocking();
  }
  registerRootComponent(App);
}

bootstrap();
