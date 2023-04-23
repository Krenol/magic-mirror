import psutil
import webbrowser
import pyautogui


class BrowserHandler:
    def __init__(self, url: str, chrome_path: str = "/usr/bin/chromium-browser"):
        self._url = url
        webbrowser.register(
            'chrome', None, webbrowser.BackgroundBrowser(chrome_path))
        self._browser = webbrowser.get('chrome')

    def openUrl(self):
        self.closeUrl()
        self._browser.open(self._url)
        self.toggleBrowserFullscreen()

    def closeUrl(self) -> bool:
        for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
            if self._isBrowserProcessWithUrl(proc):
                self._terminateProcess(proc.info['pid'])
                return True
        return False

    def _isBrowserProcessWithUrl(self, proc) -> bool:
        return 'chromium' in proc.info['name'].lower() and self._url in ' '.join(proc.info['cmdline'])

    def _terminateProcess(self, pid: int):
        proc = psutil.Process(proc.info['pid'])
        proc.terminate()

    def toggleBrowserFullscreen(self):
        pyautogui.sleep(5)
        # Send F11 key to enter fullscreen mode
        pyautogui.hotkey('F11')
