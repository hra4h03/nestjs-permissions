import { Registry } from 'prom-client';
import { dbResponseMetrics } from './DatabaseReponseTime.metrics';
import * as client from 'prom-client';

const register = new Registry();

register.registerMetric(dbResponseMetrics);
register.setDefaultLabels({ app: 'hero_game' });

client.collectDefaultMetrics({ register });

export { register };
