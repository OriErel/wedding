import React from 'react';
import { compose } from 'recompose';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';

const AdminComponent = () => <div>admin</div>;

const withAdmin = compose();
// withState('something', 'setSomething'),

export const Admin = compose(
  hot,
  withAdmin,
)(AdminComponent);
