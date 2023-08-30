import * as client from 'prom-client';

export const dbResponseMetrics = new client.Histogram({
  name: 'db_response_time',
  help: 'Database Response time',
  labelNames: ['operation', 'success'] as const,
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

export function DatabaseResponseMetrics(input: { operation?: string } = {}) {
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const end = dbResponseMetrics.startTimer();
      const operation = input.operation || propertyKey;
      try {
        const result = await originalMethod.apply(this, args);
        end({ operation, success: 'true' });
        return result;
      } catch (error) {
        end({ operation, success: 'false' });
        throw error;
      }
    };
  };
}
