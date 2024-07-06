import React from 'react';

const modules = import.meta.glob('./testcases/*.tsx');

export const routes = Object.keys(modules).map(path => {
  const Component = React.lazy(modules[path] as () => Promise<{ default: React.ComponentType }>);
  const name = path.replace('./testcases/', '').replace('.tsx', '');
  return {
    path: `/${name.toLowerCase()}`,
    component: <Component />,
    name: name,
  };
});
