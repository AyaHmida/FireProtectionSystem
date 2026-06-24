/****************************************************
 * Projet IoT Anti-Incendie - ESP32
 * Capteurs : DHT22 (Temp/Humidité), MQ2 (Gaz/Fumée)
 * Actionneurs : Buzzer, Relais/Pompe, LED Rouge/Bleue
 * Communication : MQTT (JSON strict)
 ****************************************************/

#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "DHT.h"

// ================== CONFIGURATION ==================
#define WIFI_SSID       "YOUR_WIFI_SSID"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"
#define MQTT_BROKER     "YOUR_MQTT_BROKER_IP"

#define TOPIC_PUBLISH   "home/sensors"
#define TOPIC_ALERT     "device/alert"

#define DEVICE_TYPE     "ESP32"

// ================== HARDWARE ==================
#define PIN_DHT       4
#define PIN_MQ2       34
#define PIN_BUZZER    18
#define PIN_RELAY     15
#define PIN_LED_RED   35
#define PIN_LED_BLUE  32

#define DHT_TYPE      DHT22

// ================== VARIABLES ==================
WiFiClient espClient;
PubSubClient mqttClient(espClient);
DHT dht(PIN_DHT, DHT_TYPE);

unsigned long lastMsg = 0;
bool systemReady = false;
float mq2Baseline = 0;

// ================== SETUP ==================
void setup() {
  Serial.begin(115200);

  pinMode(PIN_BUZZER, OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);
  pinMode(PIN_LED_RED, OUTPUT);
  pinMode(PIN_LED_BLUE, OUTPUT);

  digitalWrite(PIN_BUZZER, LOW);
  digitalWrite(PIN_RELAY, LOW);
  digitalWrite(PIN_LED_RED, LOW);
  digitalWrite(PIN_LED_BLUE, LOW);

  dht.begin();
  connectWiFi();
  mqttClient.setServer(MQTT_BROKER, MQTT_PORT);
  mqttClient.setCallback(handleAlert);

  calibrateMQ2();
  delay(20000); // délai sécurité
  systemReady = true;
  Serial.println("✅ System READY");
}

// ================== LOOP ==================
void loop() {
  if (!mqttClient.connected()) reconnectMQTT();
  mqttClient.loop();

  unsigned long now = millis();
  if (now - lastMsg > 5000 && systemReady) {
    lastMsg = now;
    readAndPublishSensors();
  }
}

// ================== FUNCTIONS ==================
void connectWiFi() {
  Serial.print("Connecting to WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("Connected!");
}

void reconnectMQTT() {
  while (!mqttClient.connected()) {
    Serial.print("Connecting to MQTT...");
    if (mqttClient.connect(WiFi.macAddress().c_str())) {
      Serial.println("Connected!");
      mqttClient.subscribe(TOPIC_ALERT);
mqttClient.subscribe("device/control/+");    } else {
      delay(5000);
    }
  }
}

void calibrateMQ2() {
  Serial.println("Calibrating MQ2...");
  long sum = 0;
  for (int i = 0; i < 100; i++) {
    sum += analogRead(PIN_MQ2);
    delay(100);
  }
  mq2Baseline = sum / 100.0;
  Serial.printf("MQ2 baseline: %.2f\n", mq2Baseline);
}

float readMQ2() {
  long sum = 0;
  for (int i = 0; i < 10; i++) {
    sum += analogRead(PIN_MQ2);
    delay(10);
  }
  float avg = sum / 10.0;
  if (avg < mq2Baseline * 1.05) return 0; // suppression bruit
  return avg;
}

void readAndPublishSensors() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  float gas = readMQ2();

  sendData("TEMPERATURE", temp, "C");
  sendData("HUMIDITY", hum, "%");
  sendData("GAS", gas, "ppm");

  Serial.printf("📊 Temp: %.1f°C | Hum: %.1f%% | Gaz: %.0f\n", temp, hum, gas);
}

void sendData(const char* type, float value, const char* unit) {
  StaticJsonDocument<256> doc;
  doc["device"]["id"] = WiFi.macAddress();
  doc["device"]["type"] = DEVICE_TYPE;
  doc["sensor"]["id"] = type;
  doc["sensor"]["type"] = type;
  doc["data"]["value"] = value;
  doc["data"]["unit"] = unit;
  doc["data"]["timestamp"] = millis();

  char buffer[256];
  serializeJson(doc, buffer);
  mqttClient.publish(TOPIC_PUBLISH, buffer);
}
void handleAlert(char* topic, byte* payload, unsigned int length) {

  if (!systemReady) return;

  String msg;
  for (int i = 0; i < length; i++) msg += (char)payload[i];

  Serial.printf("Alert received: %s\n", msg.c_str());

  StaticJsonDocument<256> doc;
  DeserializationError error = deserializeJson(doc, msg);
  if (error) return;

  // ===========================
  // 🎮 CONTROL COMMANDS
  // ===========================
  if (String(topic).startsWith("device/control/")) {

const char* action = doc["Action"] | doc["action"];
    if (!action) return;

    if (strcmp(action, "DISABLE_BUZZER") == 0) {
      digitalWrite(PIN_BUZZER, LOW);
      Serial.println("🔕 Buzzer OFF");
    }
    else if (strcmp(action, "ENABLE_BUZZER") == 0) {
      digitalWrite(PIN_BUZZER, HIGH);
      Serial.println("🔔 Buzzer ON");
    }
    else if (strcmp(action, "DISABLE_PUMP") == 0) {
      digitalWrite(PIN_RELAY, LOW);
      Serial.println("💧 Pump OFF");
    }
    else if (strcmp(action, "ENABLE_PUMP") == 0) {
      digitalWrite(PIN_RELAY, HIGH);
      Serial.println("💧 Pump ON");
    }

    return;
  }

  // ===========================
  // 🚨 ALERT LEVELS
  // ===========================
  const char* level = doc["level"];

  if (!level) return;

  if (strcmp(level, "NORMAL") == 0) {
    digitalWrite(PIN_LED_BLUE, HIGH);
    digitalWrite(PIN_LED_RED, LOW);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_RELAY, LOW);
  }
  else if (strcmp(level, "PRE_ALERT") == 0) {
    digitalWrite(PIN_LED_BLUE, LOW);
    digitalWrite(PIN_LED_RED, HIGH);
    digitalWrite(PIN_BUZZER, LOW);
    digitalWrite(PIN_RELAY, LOW);
  }
  else if (strcmp(level, "ALERT") == 0) {
    digitalWrite(PIN_LED_RED, HIGH);
    digitalWrite(PIN_BUZZER, HIGH);
    digitalWrite(PIN_RELAY, LOW);
  }
  else if (strcmp(level, "CRITICAL") == 0) {
    digitalWrite(PIN_LED_RED, HIGH);
    digitalWrite(PIN_BUZZER, HIGH);
    digitalWrite(PIN_RELAY, HIGH);
  }
}

