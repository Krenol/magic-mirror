from selenium import webdriver


class BrowserHandler:
    def __init__(self, url: str):
        self._url = url
        self._browser = webdriver.Chrome()

    def __del__(self):
        self._browser.quit()

    def openUrl(self):
        self.closeUrl()
        self._browser.get(self._url)
        self.toggleBrowserFullscreen()

    def closeUrl(self) -> bool:
        self._browser.quit()

    def toggleBrowserFullscreen(self):
        self._browser.maximize_window()
