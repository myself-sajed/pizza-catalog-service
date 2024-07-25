import { Kafka, KafkaConfig, Producer } from "kafkajs";
import { MessageProducerBroker } from "../common/constants/brokerType";
import config from "config";

export class KafkaProducerBroker implements MessageProducerBroker {
    private producer: Producer;

    constructor(clientId: string, brokers: string[]) {
        let kafkaConfig: KafkaConfig = { clientId, brokers };

        if (process.env.NODE_ENV === "production") {
            kafkaConfig = {
                ...kafkaConfig,
                ssl: true,
                connectionTimeout: 45000,
                sasl: {
                    username: config.get("kafka.sasl.username"),
                    password: config.get("kafka.sasl.password"),
                    mechanism: "plain",
                },
            };
        }

        const kafka = new Kafka(kafkaConfig);
        this.producer = kafka.producer();
    }

    async connect() {
        await this.producer.connect();
    }

    async disconnect() {
        if (this.producer) {
            await this.producer.disconnect();
        }
    }

    async sendMessage(topic: string, message: string) {
        await this.producer.send({ topic, messages: [{ value: message }] });
    }
}
