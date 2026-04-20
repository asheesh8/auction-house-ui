// Docs: https://kafka.js.org/docs/getting-started

import { Kafka } from 'kafkajs'

//if KAFKA_BROKER is not set, export null so producer and processor can skip connecting
//rather than crashing against a broker that doesn't exist on cloud deployments without Kafka
const kafka = process.env.KAFKA_BROKER
  ? new Kafka({
      clientId: 'auction-house',
      brokers: [process.env.KAFKA_BROKER]
    })
  : null

export default kafka