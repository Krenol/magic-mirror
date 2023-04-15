import RPi.GPIO as GPIO

sensorPin = 7  # define the sensorPin


def setup():
    print("Starting")
    GPIO.setmode(GPIO.BOARD)  # Numbers GPIOs by physical location
    GPIO.setup(sensorPin, GPIO.IN)  # Set sensorPin's mode is input


def loop():
    print("Start loop!")
    while True:
        if GPIO.input(sensorPin) == GPIO.HIGH:
            print("Motion detected")


def destroy():
    GPIO.cleanup()  # Release resource


if __name__ == '__main__':  # Program start from here
    setup()
    try:
        loop()
    # When 'Ctrl+C' is pressed, the child program destroy() will be executed.
    except KeyboardInterrupt:
        destroy()
