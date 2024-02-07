import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'products',
    path: '/',
    icon: icon('ic_cart'),
    role: 'all',
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
    role: ['customer', 'admin'],
  },
  {
    title: 'stats',
    path: '/stats',
    icon: icon('ic_analytics'),
    role: ['admin'],
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
    role: 'all',
  },
  {
    title: 'register',
    path: '/register',
    icon: icon('ic_lock'),
    role: 'all',
  },
];

export default navConfig;
