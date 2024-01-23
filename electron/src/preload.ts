// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
//
// import {ipcMain} from "electron";
import axios from "axios";
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('bridge', {
    request: (args: any) =>  ipcRenderer.invoke('request',args),
    saveExcel: (args: any) => ipcRenderer.invoke('saveExcel',args),
});

// // ipcRenderer.
//
// ipcMain.handle('request', async (_, axios_request) => {
//     // const result = await axios(axios_request)
//     // return { data: result.data, status: result.status }
// })
// import {ipcRenderer} from "electron";
// window. ipcRenderer.invoke
