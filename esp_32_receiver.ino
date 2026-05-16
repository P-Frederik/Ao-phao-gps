#include <SPI.h>
#include <LoRa.h>

#define SS 5
#define RST 14
#define DIO0 2

void setup() {

  Serial.begin(9600);

  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(433E6)) {

    Serial.println("LoRa init failed");

    while (1);
  }

  Serial.println("LoRa Receiver OK");
}

void loop() {

  int packetSize = LoRa.parsePacket();

  if (packetSize) {

    String received = "";

    while (LoRa.available()) {

      received += (char)LoRa.read();
    }

    Serial.println(received);
  }
}