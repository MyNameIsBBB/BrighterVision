#include <WiFi.h>
#include <HTTPClient.h>
#include <driver/i2s.h>
#include <TinyGPS++.h>
#include <Preferences.h>
#include <WebServer.h>

// ================= CONFIG =================
#define I2S_BCLK 14
#define I2S_LRC  15
#define I2S_DOUT 13
#define BUTTON_PIN 21
#define CONFIG_BUTTON_PIN 40 
#define GPS_RX 4 
#define GPS_TX 5
#define SAMPLE_RATE 16000

Preferences preferences;
WebServer server(80);

String savedSSID;
String savedPassword;
String savedServerBase;

// ===== DEFAULT CONFIG =====
#define DEFAULT_SSID "abcd"
#define DEFAULT_PASS "abcd"
#define DEFAULT_SERVER "http://abcd:8000"

TinyGPSPlus gps;
HardwareSerial gpsSerial(1);
SemaphoreHandle_t playAudioSemaphore;

// ================= LOAD CONFIG =================
void loadConfig() {

  preferences.begin("config", true);

  savedSSID = preferences.getString("ssid", DEFAULT_SSID);
  savedPassword = preferences.getString("pass", DEFAULT_PASS);
  savedServerBase = preferences.getString("server", DEFAULT_SERVER);

  preferences.end();

  Serial.println("Loaded Config:");
  Serial.println(savedSSID);
  Serial.println(savedServerBase);
}

// ================= CONFIG PORTAL =================
void startConfigPortal() {

  WiFi.disconnect(true);
  WiFi.mode(WIFI_AP);
  WiFi.softAP("ESP32-Setup");

  Serial.println("Config Portal Started");
  Serial.println(WiFi.softAPIP());

  server.on("/", []() {
    server.send(200, "text/html",
      "<form action='/save' method='POST'>"
      "SSID:<br><input name='ssid'><br>"
      "Password:<br><input name='pass'><br>"
      "Server Base:<br><input name='server'><br><br>"
      "<input type='submit' value='Save'>"
      "</form>");
  });

  server.on("/save", HTTP_POST, []() {

    preferences.begin("config", false);
    preferences.putString("ssid", server.arg("ssid"));
    preferences.putString("pass", server.arg("pass"));
    preferences.putString("server", server.arg("server"));
    preferences.end();

    server.send(200, "text/html", "Saved! Rebooting...");
    delay(2000);
    ESP.restart();
  });

  server.begin();

  while (true) {
    server.handleClient();
    delay(10);
  }
}
void clearConfig() {
  preferences.begin("config", false);
  preferences.clear();
  preferences.end();
  Serial.println("Config Cleared!");
  delay(1000);
  ESP.restart();
}
// ================= I2S =================
void setupI2S() {

  i2s_config_t config = {
    .mode = (i2s_mode_t)(I2S_MODE_MASTER | I2S_MODE_TX),
    .sample_rate = SAMPLE_RATE,
    .bits_per_sample = I2S_BITS_PER_SAMPLE_16BIT,
    .channel_format = I2S_CHANNEL_FMT_ONLY_LEFT,
    .communication_format = I2S_COMM_FORMAT_I2S,
    .intr_alloc_flags = ESP_INTR_FLAG_LEVEL1,
    .dma_buf_count = 16,
    .dma_buf_len = 1024,
    .use_apll = true,
    .tx_desc_auto_clear = true,
    .fixed_mclk = 0
  };

  i2s_pin_config_t pins = {
    .bck_io_num = I2S_BCLK,
    .ws_io_num = I2S_LRC,
    .data_out_num = I2S_DOUT,
    .data_in_num = I2S_PIN_NO_CHANGE
  };

  i2s_driver_install(I2S_NUM_0, &config, 0, NULL);
  i2s_set_pin(I2S_NUM_0, &pins);

  // force clock ให้ตรง
  i2s_set_clk(I2S_NUM_0, SAMPLE_RATE, I2S_BITS_PER_SAMPLE_16BIT, I2S_CHANNEL_MONO);
}

// ================= AUDIO TASK =================
void audioTask(void *pvParameters) {

  const int BUFFER_SIZE = 2048;

  uint8_t *buffer = (uint8_t*) heap_caps_malloc(
      BUFFER_SIZE,
      MALLOC_CAP_DMA
  );

  size_t bytesWritten;

  while (1) {

    if (xSemaphoreTake(playAudioSemaphore, portMAX_DELAY) == pdTRUE) {

      if (savedServerBase == "") {
        Serial.println("[Audio] Server not configured");
        continue;
      }

      Serial.println("[Audio] Requesting audio...");

      HTTPClient http;
      http.begin(savedServerBase + "/play");
      http.setTimeout(30000);
      http.addHeader("Content-Type", "application/json");

      int code = http.POST("{\"device\":\"esp32\"}");

      if (code == 200) {

        WiFiClient *stream = http.getStreamPtr();

        // ===== Skip WAV header =====
        uint8_t header[44];
        stream->readBytes(header, 44);

        Serial.println("[Audio] Pre-buffer...");

        while (stream->connected() && stream->available() < 2048) {
          vTaskDelay(5 / portTICK_PERIOD_MS);
        }

        Serial.println("[Audio] Playing...");

        while (stream->connected() || stream->available()) {

          int availableBytes = stream->available();

          if (availableBytes > 0) {

            int toRead = min(availableBytes, BUFFER_SIZE);

            int bytesRead = stream->readBytes(buffer, toRead);

            if (bytesRead > 0) {

              i2s_write(
                I2S_NUM_0,
                buffer,
                bytesRead,
                &bytesWritten,
                portMAX_DELAY
              );

            }

          } else {

            vTaskDelay(1);

          }
        }

        Serial.println("[Audio] Finished");

      } else {

        Serial.printf("[Audio] HTTP Error: %d\n", code);

      }

      http.end();
    }
  }
}

// ================= GPS TASK =================
void gpsTask(void *pvParameters) {

  unsigned long lastSendTime = 0;
  const unsigned long interval = 10000;

  while (1) {

    while (gpsSerial.available()) {
      gps.encode(gpsSerial.read());
    }

    if (millis() - lastSendTime >= interval) {

      if (savedServerBase == "") {
        vTaskDelay(1000 / portTICK_PERIOD_MS);
        continue;
      }

      float lat = gps.location.isValid() ? gps.location.lat() : 13.845891405473907;
      float lng = gps.location.isValid() ? gps.location.lng() :100.56871384146758;

      HTTPClient http;

      String url;
      url.reserve(128);
      url = savedServerBase;
      url += "/gps?lat=";
      url += String(lat, 6);
      url += "&lng=";
      url += String(lng, 6);

      http.begin(url);
      http.setTimeout(5000);

      int code = http.GET();

      if (code > 0) {
        Serial.printf("[GPS] Sent: %d\n", code);
      } else {
        Serial.println("[GPS] Failed");
      }

      http.end();
      lastSendTime = millis();
    }

    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}

// ================= BUTTON TASK =================

volatile unsigned long isrPressTime = 0;
volatile unsigned long finalPressDuration = 0;
volatile bool actionReady = false;

void IRAM_ATTR buttonISR() {
  unsigned long currentMillis = millis();
  
  if (digitalRead(BUTTON_PIN) == LOW) {
    if (isrPressTime == 0) { 
      isrPressTime = currentMillis; 
    }
  } else { 
    if (isrPressTime > 0) {
      unsigned long duration = currentMillis - isrPressTime;
      if (duration > 50) { 
        finalPressDuration = duration;
        actionReady = true;
      }
      isrPressTime = 0; 
    }
  }
}


#define TOUCH_THRESHOLD 30



void buttonTask(void *pvParameters) {
  bool isPressed = false;
  unsigned long pressStartTime = 0;

  while (1) {
    
    bool currentReading = (digitalRead(BUTTON_PIN) == HIGH); 

    if (currentReading) { 
      if (!isPressed) {
        vTaskDelay(50 / portTICK_PERIOD_MS); 
        if (digitalRead(BUTTON_PIN) == HIGH) { 
          isPressed = true;
          pressStartTime = millis();
          Serial.println("[Button] Pressing...");
        }
      }
    } 
    else { 
      if (isPressed) {
        unsigned long duration = millis() - pressStartTime;
        Serial.printf("[Button] Released. Duration: %lu ms\n", duration);
        
        
        if (duration >= 2000) {
          Serial.println("[Button] Action: Play Audio");
          if (playAudioSemaphore != NULL) {
            xSemaphoreGive(playAudioSemaphore); 
          }
        } else {
          Serial.println("[Button] Ignored (Pressed < 2s)");
        }
        isPressed = false;
        vTaskDelay(50 / portTICK_PERIOD_MS); 
      }
    }
    vTaskDelay(20 / portTICK_PERIOD_MS);
  }
}

// ================= CONFIG BUTTON TASK =================
void configButtonTask(void *pvParameters) {
  Serial.println("[ConfigBtn] Task started.");

  bool isPressed = false;
  unsigned long pressStartTime = 0;

  while (1) {
   
    bool currentReading = (digitalRead(CONFIG_BUTTON_PIN) == HIGH);

    if (currentReading) { 
      if (!isPressed) {
        vTaskDelay(50 / portTICK_PERIOD_MS); 
        if (digitalRead(CONFIG_BUTTON_PIN) == HIGH) {
          isPressed = true;
          pressStartTime = millis();
          Serial.println("[ConfigBtn] Pressing...");
        }
      } else {
        
        if (millis() - pressStartTime >= 5000) {
          Serial.println("[ConfigBtn] Held for 5s! Entering Config Mode...");
          startConfigPortal(); 
          isPressed = false; 
        }
      }
    } 
    else { 
      if (isPressed) {
        Serial.println("[ConfigBtn] Released before 5s.");
        isPressed = false;
        vTaskDelay(50 / portTICK_PERIOD_MS); 
      }
    }
    vTaskDelay(20 / portTICK_PERIOD_MS);
  }
}
int i = 0 ;
// ================= SETUP =================
void setup() {

  Serial.begin(115200);
  delay(2000);
  // if(i==0){
  //   clearConfig();
  // }
  // i++;
  gpsSerial.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);
  pinMode(BUTTON_PIN, INPUT);
  pinMode(CONFIG_BUTTON_PIN, INPUT);

  setupI2S();
  loadConfig();



  WiFi.mode(WIFI_STA);
  WiFi.begin(savedSSID.c_str(), savedPassword.c_str());
  WiFi.setAutoReconnect(true);
  WiFi.persistent(true);

  unsigned long startAttempt = millis();

  while (WiFi.status() != WL_CONNECTED) {
    if (millis() - startAttempt > 15000) {
      startConfigPortal();
    }
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi Connected");
  Serial.println(WiFi.localIP());

  playAudioSemaphore = xSemaphoreCreateBinary();


  xTaskCreatePinnedToCore(audioTask, "AudioTask", 10000, NULL, 2, NULL, 0);
  xTaskCreatePinnedToCore(gpsTask,   "GPSTask",   5000,  NULL, 1, NULL, 1);
  xTaskCreatePinnedToCore(buttonTask,"BtnTask",   4000,  NULL, 3, NULL, 1); 
  xTaskCreatePinnedToCore(configButtonTask, "CfgBtnTask", 4000, NULL, 3, NULL, 1);
}

void loop() {
  vTaskDelete(NULL);
}