import MockAdapter from 'axios-mock-adapter';
import api from './axiosClient';
import { ENDPOINTS } from './endpoints';
import { mockAdmin } from './mockData';

const mock = new MockAdapter(api, { delayResponse: 400 });

mock.onPost(ENDPOINTS.adminLogin).reply((config) => {
  const { username, password } = JSON.parse(config.data);

  if (username === mockAdmin.username && password === mockAdmin.password) {
    return [200, {
      adminId: 'admin-1',
      name: mockAdmin.name,
      accessToken: 'mock-admin-token',
      refreshToken: 'mock-admin-refresh',
      expiresInSeconds: 3600,
    }];
  }

  return [401, { title: 'Incorrect username or password', errorCode: 'INVALID_CREDENTIALS' }];
});

export default mock;