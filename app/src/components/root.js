import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Switch } from 'react-router';
import styled from 'styled-components';

import { Admin } from './admin';
import { GuestRSVP } from './guest-rsvp';

const Container = styled.div`
  font-family: 'Alef', sans-serif;
  width: 100%;
  color: #444444;
  direction: rtl;
`;

export const Root = () => (
  <Container>
    <BrowserRouter>
      <Switch>
        <Route path="/admin" component={Admin} />
        <Route path="/:guestId" component={GuestRSVP} />
      </Switch>
    </BrowserRouter>
  </Container>
);
