import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Canvas from './components/Canvas';
import NodeSidebar from '../src/components/NodeConfigPanel';
        import { ToastContainer, toast } from 'react-toastify';

import './index.css';

const App = () => {
  return (
    <Provider store={store}>
      <ToastContainer/>
      <div style={{ display: 'flex', height: '100vh' }}>
        <NodeSidebar />
        <Canvas />
      </div>
    </Provider>
  );
};

export default App;
