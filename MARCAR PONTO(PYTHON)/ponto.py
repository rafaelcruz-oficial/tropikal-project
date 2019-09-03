import os
import sys
import unittest
import random
import getpass
import threading
from time import sleep

from selenium import webdriver
from selenium.webdriver import FirefoxProfile
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.switch_to import SwitchTo
from selenium.webdriver.support import expected_conditions as ExpC
from selenium.webdriver.support.ui import WebDriverWait as Wait
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import NoSuchElementException

MAIN_URL = "https://sondait.com.br/"



class DriverFF:

    def __init__(self):
        self.driver = None
        self.loged = False


    def getDriver(self):
        return self.driver


    def openFF(self):
        profile = FirefoxProfile()
        profile.set_preference('network.http.phishy-userpass-length', 255)
        profile.set_preference('network.automatic-ntlm-auth.trusted-uris', '.sondait.com.br')
        #profile.set_preference('dom.disable_beforeunload', 'false')

        options = Options()
        # options.set_headless(True)
        # options.headless = True
        # options.add_argument('-headless')
        # options.add_argument("-headless") # Runs Chrome in headless mode.
        # options.add_argument('-no-sandbox') # Bypass OS security model
        # options.add_argument('-disable-gpu')  # applicable to windows os only
        # options.add_argument('start-maximized') # 
        # options.add_argument('disable-infobars')
        # options.add_argument("-disable-extensions")

        print ("Headless FF initializing...")
        self.driver = webdriver.Firefox(executable_path='C:\Arris\geckodriver.exe', options=options, firefox_profile=profile)
        if self.driver:
            print ("Headless FF initialized")
            self.driver.implicitly_wait(10)
            self.driver.delete_all_cookies()
            return True
        else:
            print ("Error FF not initialized")
            return False


    def closeFF(self):
        if self.driver:
            self.driver.quit()
            print("Closed FF")
            return True
        else:
            print("Could not find FF")
            return False


    def goTo(self,  url):
        if self.driver:
            self.driver.get(url)
            sleep(5)
            return True
        else:
            print("Could not find FF")
            return False


    def doLogin(self, credential):
        if self.driver:
            alert = Alert(self.driver)
            if alert and credential:
                print(alert)
                #alert.send_keys(f'u{Keys.TAB}p')
                #alert.send_keys( usr + Keys.TAB + pwd )
                alert.send_keys(str(credential))
                sleep(5)
                alert.accept()
                sleep(10)
                print(self.driver.current_url)
                if self.driver.current_url == MAIN_URL:
                    self.loged = True
                    print("Loged IN !  :)")
                    return True
                else:
                    alert.dismiss()
                    print("Could not log in..  :(")
                    return False
            else:
                print("Could not auth alert")
                return False
        else:
            print("Could not find driver FF")
            return False


    def doMagic(self):
        print("AQUI 1")
        try:
            if self.loged:
                self.driver.execute_("window.scrollTo(0, document.body.scrollHeight*0.8);")
                btnNovo = self.driver.find_element_by_id("createNewPoint")
                if btnNovo:
                    btnNovo.click()
                    sleep(5)

                    divHour = self.driver.find_element_by_id("currentHourArea")
                    if divHour:


                        btnPoint = self.driver.find_element_by_id("pointImage")
                        if btnPoint and btnPoint.is_enabled():
                            btnPoint.click()
                            sleep(15)
                        else:
                            print("Sem btnPoint")
                            raise


                        # btnMeal = self.driver.find_element_by_id("mealImage")
                        # if btnMeal and btnMeal.is_enabled():
                        #     btnMeal.click()
                        #     sleep(15)
                        # else:
                        #     print("Sem btnMeal")
                        #     raise


                        # btnSave = self.driver.find_element_by_id("Save")
                        # if btnSave and btnSave.is_enabled():
                        #     btnSave.click()
                        #     sleep(15)
                        # else:
                        #     print("Sem btnSave")
                        #     raise

                    else:
                        print("Sem divHour")
                        raise
                else:
                    print("Sem btnNovo")
                    raise

        except (RuntimeError, TypeError, NameError, AssertionError, Exception) as err:
            print("Could not find element for 10s the first time. :(  {0}".format(err))
            pass
        else:
            print("Found element the first time! :)")
            pass
        finally:
            pass




class Login:

    def __init__(self):
        self.user = None
        self.password = None


    def doInput(self):
        self.user = input('user:')
        #self.password = input('password:')
        self.password = getpass.getpass()


    def getParanáuê(self):
        return str(self.user + Keys.TAB + self.password)




def main():
    print("Hello World !")

    logMeIn = Login()
    logMeIn.doInput()

    driverFF = DriverFF()
    driverFF.openFF()
    driverFF.goTo(MAIN_URL)
    driverFF.doLogin(logMeIn.getParanáuê())
    driverFF.doMagic()
    driverFF.closeFF()

    print("Done !")



if __name__== "__main__":
    main()
