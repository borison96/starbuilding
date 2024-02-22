import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import i18n from './i18n';
import store from './services/redux/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AppDragLayer } from './ui-components/drag-n-drop/AppDragLayer.component';
import { ToastLayer } from './pages/layers/Toast.layer';

ReactDOM.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
        <Provider store={store}>
          <ToastLayer />
          <DndProvider backend={HTML5Backend}>
            <AppDragLayer />
            <App />
          </DndProvider>
        </Provider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
