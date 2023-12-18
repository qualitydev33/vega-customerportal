import { render } from '@testing-library/react';

import App from './app';
import {BrowserRouter} from "react-router-dom";
import {RecoilRoot} from "recoil";
import {CustomKeycloakProvider} from "../../../../libs/sharedcomponents/src";

const getApp = () =>{
  return(    <CustomKeycloakProvider config={'./assets/keycloakConfig.json'}>
    <RecoilRoot><BrowserRouter>
    <App />
    </BrowserRouter></RecoilRoot></CustomKeycloakProvider>)
  }
describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(getApp());
    expect(baseElement).toBeTruthy();
  });
});
