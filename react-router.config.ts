import type { Config } from '@react-router/dev/config';

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  basename: import.meta.env.PROD ? '/react_leaning/' : '/',
  ssr: true,
} satisfies Config;
