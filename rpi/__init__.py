import time
import RPi.GPIO as GPIO
from rpi.browser_handler import BrowserHandler
from rpi.movement_detector import DisplayState, MotionSensor, ScreenToggle

SENDSOR_PIN = 11  # define the sensorPin
MIRROR_URL = "https://nuc.fritz.box"
CHROME_PATH = "/usr/bin/chromium-browser"


def loop():
    print("Start display state loop")
    motionSensor = MotionSensor(SENDSOR_PIN)
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
    browserHandler = BrowserHandler(MIRROR_URL, CHROME_PATH)
    try:
        browserHandler.openUrl()
        loop()
    # When 'Ctrl+C' is pressed, the child program destroy() will be executed.
    except KeyboardInterrupt:
        GPIO.cleanup()
        browserHandler.closeUrl()
