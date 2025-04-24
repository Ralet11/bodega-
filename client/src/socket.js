import socketIOClient from "socket.io-client";

import { getParamsEnv } from "./functions/getParamsEnv";
const {API_URL_BASE} = getParamsEnv()

console.log(API_URL_BASE, "api")

const SOCKET_URL = API_URL_BASE;

// Crea la instancia del socket solo una vez
const socket = socketIOClient(SOCKET_URL);

export default socket;