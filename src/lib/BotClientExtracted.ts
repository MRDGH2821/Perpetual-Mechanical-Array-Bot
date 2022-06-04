import { ShardClient } from 'detritus-client';
import { RestClient } from 'detritus-client/lib/rest';

const restClients: RestClient[] = [];

export function setRestClient(RClient: RestClient) {
  restClients.push(RClient);
  console.log('Rest client set');
}

export function getRestClient(): RestClient {
  if (!restClients.length) {
    throw new Error('Rest client not initialised, use setRestClient first.');
  } else {
    return restClients[0];
  }
}

const shardClients: ShardClient[] = [];

export function setShardClient(SClient: ShardClient) {
  shardClients.push(SClient);
  console.log('Shard client set');
}

export function getShardClient(): ShardClient {
  if (!shardClients.length) {
    throw new Error('Shard client not initialised, use setShardClient first.');
  } else {
    return shardClients[0];
  }
}
