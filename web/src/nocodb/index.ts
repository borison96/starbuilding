import axios from 'axios';
import { Api } from 'nocodb-sdk';
import { getForViewAndSize } from 'ol/extent';
import { getConfig } from '../utils/config';
const config = getConfig();
export const nocoBackend = axios.create({
    baseURL: config.nocoDBUrl,
    responseType: 'json',
    headers: {
        'xc-token': config.nocoDBToken,
        accept: 'application/json',
    }
});

export const noco = new Api({
    baseURL: config.nocoDBUrl,
    headers: {
        'xc-token': config.nocoDBToken,
        accept: 'application/json',
    }
});

export const list = (table: string, query?: { fields?: any[]; sort?: any[]; where?: string; }) => noco.dbTableRow.list('noco', config.nocoDBProject, table, query);
export const listViewColumns = (view: string) => noco.dbViewColumn.list(view);
