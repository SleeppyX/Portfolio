const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // ไม่ใช้ Cypress.env() ปิดไว้ตามคำแนะนำด้านความปลอดภัยของ Cypress
  allowCypressEnv: false,
  e2e: {
    // เว็บที่จะเทสต์ (ตั้งผ่าน CYPRESS_BASE_URL ได้) ค่าเริ่มต้นคือ dev/production server ในเครื่อง
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "e2e/**/*.cy.js",
    supportFile: false,
    video: false,
  },
});
