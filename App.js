import React, {useState, useEffect} from 'react';
import { GlobalContext, GlobalProvider } from './src/components/globalState';

import Tabs from './src/components/Tabs'

export default function App() {

  return (
    <GlobalProvider>
      <Tabs />
    </GlobalProvider>  
  );
}

