import mqtt from 'mqtt';
import type { IClientSubscribeOptions, IClientSubscribeProperties } from 'mqtt';
import mitt from 'mitt';
import { readFileSync } from 'fs';
type Arrayable<T> = T | T[];
function isString(value: unknown): value is string {
  return value instanceof String;
}

// https://github.com/mqttjs/MQTT.js
// https://test.mosquitto.org/
// https://test.mosquitto.org/ssl/mosquitto.org.crt
export class MqttClient {
  private emitter = mitt<{
    [key: string]: {
      payload: Buffer;
      packet: mqtt.IPublishPacket;
    };
  }>();
  private client: mqtt.MqttClient;
  constructor(brokerUrl: string, options?: mqtt.IClientOptions) {
    this.client = mqtt.connect(brokerUrl, options);
    this.client.on('message', (topic, payload, packet) => {
      this.emitter.emit(topic, { payload, packet });
    });
  }
  end() {
    this.emitter.all.clear();
    this.client.end();
  }
  async subscribe(
    topic: Arrayable<string>,
    cb: (payload: Buffer, packet: mqtt.IPublishPacket) => void,
    opts?: IClientSubscribeOptions | IClientSubscribeProperties
  ) {
    [topic]
      .flat()
      .forEach((t) =>
        this.emitter.on(t, ({ payload, packet }) => cb(payload, packet))
      );
    return this.client.subscribeAsync(topic, opts);
  }
  async unsubscribe(topic: Arrayable<string>, opts?: IClientSubscribeOptions) {
    [topic].flat().forEach((t) => this.emitter.all.delete(t));
    return this.client.unsubscribeAsync(topic, opts);
  }
  async publish(topic: string, data: string | Record<string, any>) {
    if (!isString(data)) data = JSON.stringify(data);
    return this.client.publishAsync(topic, data);
  }
}

(async () => {
  const ca = readFileSync('./mosquitto.org.crt').toString();
  const client = new MqttClient('mqtts://test.mosquitto.org', { ca });
  await client.subscribe('test', (payload) => {
    console.log(payload.toString());
  });
  await client.publish('test', 'Hellow World!');
})();
