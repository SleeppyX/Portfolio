"""Robot Framework listener: บันทึกเวลาเริ่มและจบของแต่ละเทสต์ตอนอัดวิดีโอ"""

import json
import os
import time

ROBOT_LISTENER_API_VERSION = 3


def start_test(data, result):
    with open(os.environ["RECORD_STEPS_FILE"], "a", encoding="utf-8") as file:
        file.write(json.dumps({"title": data.name, "time": time.time()}) + "\n")


def end_test(data, result):
    with open(os.environ["RECORD_STEPS_FILE"], "a", encoding="utf-8") as file:
        file.write(json.dumps({"end": time.time()}) + "\n")
