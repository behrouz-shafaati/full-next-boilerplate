import React from 'react';
import dynamic from 'next/dynamic';
const DraggableList = dynamic(() => import('@/components/page-builder'), {
  ssr: false,
});

const Home: React.FC = () => {
  return (
    <div>
      <h1>لیست کشیدن و رها کردن</h1>
      <DraggableList />
    </div>
  );
};

export default Home;
