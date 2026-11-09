*** Settings ***
Documentation     Project detail pages (EN/TH) and the 404 page
Library           SeleniumLibrary
Suite Setup       Open Test Browser
Suite Teardown    Close All Browsers

*** Variables ***
${BASE_URL}       http://localhost:3000
# ตอนอัดวิดีโอ: ต่อเข้ากับ Chrome ที่ตัวอัดเปิดไว้ (เช่น 127.0.0.1:9555)
${DEBUGGER}       ${EMPTY}

*** Test Cases ***
Every Project Page Opens
    FOR    ${slug}    IN    portfolio-site    ml-pipeline-generator    e-cmis    rsa-3d-encryption    tuty-shop
        Go To    ${BASE_URL}/en/projects/${slug}
        Page Should Contain Element    css:article h1
        Page Should Contain    Back to projects
    END

Thai Project Page Is Translated
    Go To    ${BASE_URL}/th/projects/tuty-shop
    Page Should Contain    เครื่องใช้ไฟฟ้าคลายร้อน

Back Link Returns To Projects Section
    Go To    ${BASE_URL}/en/projects/e-cmis
    Click Link    Back to projects
    Wait Until Location Is    ${BASE_URL}/en/portfolio#projects    timeout=10s

Unknown Project Shows 404
    Go To    ${BASE_URL}/en/projects/does-not-exist
    Page Should Contain    Page not found

*** Keywords ***
Open Test Browser
    IF    "${DEBUGGER}"
        Open Browser    ${BASE_URL}/en    chrome
        ...    options=add_experimental_option("debuggerAddress", "${DEBUGGER}")
        # หน่วงแต่ละคำสั่งให้คนดูวิดีโอตามทัน
        Set Selenium Speed    0.5s
    ELSE
        Open Browser    ${BASE_URL}/en    headlesschrome
    END
