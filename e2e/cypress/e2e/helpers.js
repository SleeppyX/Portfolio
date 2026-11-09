// ตัวช่วยที่ใช้ร่วมกันในทุก spec
// รอให้ React hydrate ปุ่มเสร็จก่อน ไม่อย่างนั้นการคลิกจะยังไม่มีผล
export const waitForHydration = () =>
  cy.get('button[aria-label="Toggle dark mode"]').should(($button) => {
    expect(Object.keys($button[0]).some((key) => key.startsWith("__reactProps"))).to.equal(true);
  });
