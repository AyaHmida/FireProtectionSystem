# ESP32 Firmware

Firmware du système IoT anti-incendie basé sur ESP32.

## Fonctionnalités
- Lecture des capteurs DHT22 et MQ2.
- Communication MQTT.
- Alertes en temps réel.
- Contrôle du buzzer et de la pompe via MQTT.
- Gestion des niveaux d'alerte (NORMAL, PRE_ALERT, ALERT, CRITICAL).

## Bibliothèques utilisées
- WiFi
- PubSubClient
- ArduinoJson
- DHT sensor library
