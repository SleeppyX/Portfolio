"""หน้า Portfolio: เมนู, Test Runner ใน Hero, section ผลงาน และการ์ดเซนเซอร์"""

import os

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

BASE_URL = os.environ.get("BASE_URL", "http://localhost:3000")


@pytest.fixture
def driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--window-size=1280,900")
    browser = webdriver.Chrome(options=options)
    browser.get(f"{BASE_URL}/en/portfolio")
    yield browser
    browser.quit()


def test_nav_links_to_every_section(driver):
    nav = driver.find_element(By.CSS_SELECTOR, "header nav")
    labels = [link.text for link in nav.find_elements(By.TAG_NAME, "a")]
    assert labels == ["About", "Skills", "Testing", "Lab", "Experience", "Projects", "Contact"]


def test_hero_test_runner_passes(driver):
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".test-runner"), "passing")
    )
    assert "4 passing" in driver.find_element(By.CSS_SELECTOR, ".test-runner").text


def test_projects_section_lists_every_project(driver):
    cards = driver.find_elements(By.CSS_SELECTOR, "#projects a[href^='/en/projects/']")
    assert len(cards) == 5


def test_lab_shows_sensor_node(driver):
    # section ค่อยๆ แสดงตอนเลื่อนมาถึง จึงต้องเลื่อนไปก่อนแล้วรอให้มองเห็น
    lab = driver.find_element(By.ID, "lab")
    driver.execute_script("arguments[0].scrollIntoView();", lab)
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.ID, "lab"), "node-bkk-01")
    )
