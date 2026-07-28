import React from 'react';
import dynamic from 'next/dynamic';

const TinaAdmin = dynamic(
  () => import('@tinacms/datalayer').then((mod) => mod.TinaAdmin),
  { ssr: false }
);

export default function Admin() {
  return <TinaAdmin />;
}
