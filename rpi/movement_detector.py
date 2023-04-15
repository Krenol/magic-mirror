import subprocess
import RPi.GPIO as GPIO
import time
from enum import Enum

sensorPin = 11  # define the sensorPin


class DisplayState(str, Enum):
    on = 'on'
    off = 'off'


class ScreenToggle:
    def __init__(self):
        self._currentScreenState = "off"

    def setScreenState(self, state: DisplayState) -> None:
        if self._currentScreenState != state:
            subprocess.run(
                ["xset", "-display", ":0.0", "dpms", "force", state])
            self._currentScreenState = state


class MotionSensor:
    def __init__(self, pin: int):
        self._pin = pin
        GPIO.setup(self._pin, GPIO.IN)

    def motionIsDetected(self) -> bool:
        return GPIO.input(self._pin) == GPIO.HIGH


def loop():
    print("Start loop!")
    motionSensor = MotionSensor(sensorPin)
    screenToggle = ScreenToggle()
    while True:
        if motionSensor.motionIsDetected():
            screenToggle.setScreenState("on")
            time.sleep(1)
        else:
            screenToggle.setScreenState("off")


if __name__ == '__main__':  # Program start from here
    GPIO.setmode(GPIO.BOARD)
    try:
        loop()
    # When 'Ctrl+C' is pressed, the child program destroy() will be executed.
    except KeyboardInterrupt:
        GPIO.cleanup()
