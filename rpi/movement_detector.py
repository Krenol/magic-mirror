import subprocess
import RPi.GPIO as GPIO
import time

sensorPin = 11  # define the sensorPin
currentScreenState = "off"


def setup():
    print("Starting")
    GPIO.setmode(GPIO.BOARD)  # Numbers GPIOs by physical location
    GPIO.setup(sensorPin, GPIO.IN)  # Set sensorPin's mode is input


def loop():
    print("Start loop!")
    while True:
        if GPIO.input(sensorPin) == GPIO.HIGH:
            print("Motion detected")
            time.sleep(1)
            toggleScreen(True)
        else:
            toggleScreen(False)


def toggleScreen(turnOn: bool):
    stateStr = "off"
    if turnOn:
        stateStr = "on"
    if currentScreenState != stateStr:
        subprocess.run(
            ["xset", "-display", ":0.0", "dpms", "force", stateStr])
        currentScreenState = stateStr


def destroy():
    GPIO.cleanup()  # Release resource


if __name__ == '__main__':  # Program start from here
    setup()
    try:
        loop()
    # When 'Ctrl+C' is pressed, the child program destroy() will be executed.
    except KeyboardInterrupt:
        destroy()
