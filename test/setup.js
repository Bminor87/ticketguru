import { beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

global.mockAxios = new MockAdapter(axios);

beforeEach(() => {
  global.mockAxios.reset();
});

afterEach(() => {
  global.mockAxios.resetHandlers();
});
