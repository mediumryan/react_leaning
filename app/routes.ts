import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('contents/:id', 'routes/contents.tsx'),
  route('community', 'routes/community.tsx'),
  route('settings', 'routes/settings.tsx'),
  route('users', 'routes/users.tsx'),
] satisfies RouteConfig;
