const int trigPin = 5;
const int echoPin = 11;
const int moisturePin = 18;
const int buzzer = 10;

unsigned long lastSensorRead = 0;
unsigned long lastBuzzerAction = 0;
const long sensorInterval = 100; 

int distance = 0;
int moistureValue = 0;

int beepInterval = 0; 
int currentPitch = 0;
bool buzzerState = false;
int distance_Con = 30;

void setup() {
  Serial.begin(115200);
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(moisturePin, INPUT);
  pinMode(buzzer, OUTPUT);
}

void loop() {
  unsigned long currentMillis = millis();

  if (currentMillis - lastSensorRead >= sensorInterval) {
    lastSensorRead = currentMillis;

    digitalWrite(trigPin, LOW); 
    delayMicroseconds(2);
    digitalWrite(trigPin, HIGH); 
    delayMicroseconds(10);
    digitalWrite(trigPin, LOW);
    
    long duration = pulseIn(echoPin, HIGH, 25000); 
    
    if (duration == 0) {
      distance = 999; 
    } else {
      distance = ((duration * 0.034) / 2)-distance_Con;
    }

    if (distance <= 0){
      distance = distance_Con;
    }
    moistureValue = 4095 - analogRead(moisturePin);

    bool isWet = (moistureValue > 500);
    bool isNearWall = (distance > 0 && distance <= 150); 
    bool isVeryClose = (distance > 0 && distance <= 5);  

    if (isWet && isNearWall) {
      currentPitch = 3000; 
      if (isVeryClose) {
        beepInterval = -1; 
        Serial.println("วิกฤตสุดๆ: เจอน้ำและกำแพงชิดมาก!");
      } else {
        beepInterval = distance * 5; 
        Serial.println("วิกฤต: เจอน้ำและสิ่งกีดขวาง!");
      }
    } 
    else if (isWet) {
      beepInterval = -1; 
      currentPitch = 2000; 
      Serial.println("ระวัง: พื้นเปียก!");
    } 
    else if (isNearWall) {
      currentPitch = 1000; 
      if (isVeryClose) {
        beepInterval = -1; 
      } else {
        beepInterval = distance * 10; 
        Serial.print(distance); 
        Serial.println(" cm");
      }
    } 
    else {
      beepInterval = 0; 
    }
  }

  if (beepInterval == -1) {
    tone(buzzer, currentPitch);
  } 
  else if (beepInterval > 0) {
    if (currentMillis - lastBuzzerAction >= beepInterval) {
      lastBuzzerAction = currentMillis;
      buzzerState = !buzzerState; 
      
      if (buzzerState) {
        tone(buzzer, currentPitch);
      } else {
        noTone(buzzer);
      }
    }
  } 
  else {
    noTone(buzzer);
    buzzerState = false;
  }
}
