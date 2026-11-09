"""บันทึกเวลาเริ่มและจบของแต่ละเทสต์ (ใช้ตอนอัดวิดีโอด้วย e2e/recorder เท่านั้น)"""

import json
import os
import time

STEPS_FILE = os.environ.get("RECORD_STEPS_FILE")


def pytest_runtest_logstart(nodeid, location):
    if not STEPS_FILE:
        return
    name = nodeid.split("::")[-1].removeprefix("test_").replace("_", " ")
    with open(STEPS_FILE, "a", encoding="utf-8") as file:
        file.write(json.dumps({"title": name, "time": time.time()}) + "\n")


def pytest_runtest_logfinish(nodeid, location):
    if not STEPS_FILE:
        return
    with open(STEPS_FILE, "a", encoding="utf-8") as file:
        file.write(json.dumps({"end": time.time()}) + "\n")
