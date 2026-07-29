import React from 'react';
import ComponentTypes from '@theme-original/NavbarItem/ComponentTypes';
import BrandSwitcher from '@site/src/components/BrandSwitcher';

export default {
  ...ComponentTypes,
  'custom-brandSwitcher': () => <BrandSwitcher />,
};
