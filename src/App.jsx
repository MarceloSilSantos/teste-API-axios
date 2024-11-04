import React from 'react';
import OrcamentoCRUD from './OrcamentoCRUD';
import ProjetoCRUD from './ProjetoCRUD';
import UserCRUD from './UserCRUD';

function App() {
  return (
    <div>
      
      <UserCRUD />
      <ProjetoCRUD />
      <OrcamentoCRUD />
    </div>
    
  );
}

export default App
