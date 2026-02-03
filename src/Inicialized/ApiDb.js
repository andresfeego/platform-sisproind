import request from 'superagent';
import { buildBackendUrl } from './BackendConfig';

export const helpersGetDb = (path) => buildBackendUrl(path);
export const helpersSetDb = (path) => buildBackendUrl(path);

export const getDb = (path) => request.get(helpersGetDb(path));
export const setDb = (path) => request.post(helpersSetDb(path));
