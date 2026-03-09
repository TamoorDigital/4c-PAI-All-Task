import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def bypass_recaptcha(url):
    options = Options()
    options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    
    try:
        driver.get(url)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "recaptcha")))
        
        iframe = driver.find_element(By.TAG_NAME, "iframe")
        driver.execute_script("arguments[0].scrollIntoView();", iframe)
        
        time.sleep(2)
        driver.switch_to.frame(iframe)
        
        checkbox = driver.find_element(By.ID, "recaptcha-anchor")
        checkbox.click()
        
        time.sleep(5)
        driver.switch_to.default_content()
        
        return driver.page_source
        
    finally:
        driver.quit()