// create a singleton of broker in order to avoid multiple broker instances

import { KafkaProducerBroker } from "../../services/kafka";
import { MessageProducerBroker } from "../constants/brokerType";
import config from "config";

let messageProducer: MessageProducerBroker | null = null;

export function createMessageProducerBroker() {
    const broker = config.get("kafka.broker");
    if (!messageProducer) {
        messageProducer = new KafkaProducerBroker(
            "catalog-service",
            broker as string[],
        );
    }

    return messageProducer;
}
