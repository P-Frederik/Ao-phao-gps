#include <SPI.h>
#include <LoRa.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

TinyGPSPlus gps;

HardwareSerial gpsSerial(1);

/*
====================================
GPS PINS
====================================

GPS TX -> ESP32 RX2 GPIO16
GPS RX -> ESP32 TX2 GPIO17

====================================
LORA SX1278 PINS
====================================

NSS  -> 5
RST  -> 14
DIO0 -> 2
SCK  -> 18
MISO -> 19
MOSI -> 23
====================================
*/

#define SS 5
#define RST 14
#define DIO0 2

void setup() {

  Serial.begin(9600);

  gpsSerial.begin(
    9600,
    SERIAL_8N1,
    16,
    17
  );

  LoRa.setPins(SS, RST, DIO0);

  if (!LoRa.begin(433E6)) {

    Serial.println("LoRa init failed");

    while (1);
  }

  Serial.println("LoRa OK");
}

void loop() {

  while (gpsSerial.available()) {

    gps.encode(gpsSerial.read());
  }

  if (gps.location.isUpdated()) {

    float lat = gps.location.lat();
    float lng = gps.location.lng();

    String data =
      "LAT:" +
      String(lat, 6) +
      ",LNG:" +
      String(lng, 6);

    LoRa.beginPacket();

    LoRa.print(data);

    LoRa.endPacket();

    Serial.println(data);

    delay(3000);
  }
}