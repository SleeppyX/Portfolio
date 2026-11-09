// ใช้เฉพาะตอนอัดวิดีโอ (e2e/recorder): หน่วงให้คนดูวิดีโอตามทัน
// (Cypress ไม่ให้ overwrite คำสั่งประเภท query เช่น get/contains จึงหน่วงแค่ visit/click)
const DELAY_MS = { visit: 1200, click: 900 };

for (const [command, delay] of Object.entries(DELAY_MS)) {
  Cypress.Commands.overwrite(command, (originalFn, ...args) =>
    originalFn(...args).then(
      (result) => new Cypress.Promise((resolve) => setTimeout(() => resolve(result), delay)),
    ),
  );
}

// พักสั้นๆ หลังจบแต่ละเทสต์ ให้เห็นผลก่อนขึ้นเทสต์ถัดไป
afterEach(() => {
  cy.wait(800);
});
