const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // ไม่ใช้ Cypress.env() ปิดไว้ตามคำแนะนำด้านความปลอดภัยของ Cypress
  allowCypressEnv: false,
  e2e: {
    // เว็บที่จะเทสต์ (ตั้งผ่าน CYPRESS_BASE_URL ได้) ค่าเริ่มต้นคือ dev/production server ในเครื่อง
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "e2e/**/*.cy.js",
    // ตอนอัดวิดีโอใช้ slowmo.js หน่วงคำสั่งให้ดูทัน ตอนรันปกติไม่มี support file
    supportFile: process.env.RECORD_VIDEOS_DIR ? "support/slowmo.js" : false,
    // อัดวิดีโอเฉพาะตอนรันจากตัวอัด (e2e/recorder) ซึ่งจะส่งโฟลเดอร์ผ่าน RECORD_VIDEOS_DIR
    video: Boolean(process.env.RECORD_VIDEOS_DIR),
    videosFolder: process.env.RECORD_VIDEOS_DIR || "cypress/videos",
    setupNodeEvents(on) {
      // ตอนอัดวิดีโอ (e2e/recorder): บันทึกชื่อและเวลาของแต่ละเทสต์ไว้ทำรายการ step
      on("after:spec", (spec, results) => {
        const file = process.env.RECORD_STEPS_FILE;
        if (!file || !results) return;
        const tests = results.tests.map((test) => ({
          title: test.title.at(-1),
          duration: test.duration,
          state: test.state,
        }));
        require("node:fs").writeFileSync(file, JSON.stringify({ video: results.video, tests }));
      });
    },
  },
});
