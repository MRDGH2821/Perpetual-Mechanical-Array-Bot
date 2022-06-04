import { RestClient } from 'detritus-client/lib/rest';

const restClients: any = [];

export function setRestClient(RClient: RestClient) {
  restClients.push(RClient);
  console.log('Rest client set');
}

export function getRestClient(): RestClient {
  if (typeof restClients[0] !== typeof RestClient) {
    throw new Error('Rest client not initialised, use setRestClient first.');
  } else {
    return restClients[0];
  }
}
