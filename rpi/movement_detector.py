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

    def multiMotionIsDetect(self, count: int = 5):
        res = []
        threshold = count / 2
        while count > 0:
            res.append(self.motionIsDetected())
            count = count - 1
            time.sleep(50/1000)
        return sum(res) >= threshold


def loop():
    print("Start display state loop")
    motionSensor = MotionSensor(sensorPin)
    screenToggle = ScreenToggle()
    while True:
        if motionSensor.multiMotionIsDetect(5):
            print("Turn display on")
            screenToggle.setScreenState(DisplayState.on)
        else:
            print("Turn display off")
            screenToggle.setScreenState(DisplayState.off)
        time.sleep(1)


if __name__ == '__main__':  # Program start from here
    GPIO.setmode(GPIO.BOARD)
    try:
        loop()
    # When 'Ctrl+C' is pressed, the child program destroy() will be executed.
    except KeyboardInterrupt:
        GPIO.cleanup()
