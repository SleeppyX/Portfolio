// หน้า Bio (หน้าแรก): ข้อมูลส่วนตัว ลิงก์ social ปุ่ม Discord และการสลับภาษา/ธีม
// รอให้ React hydrate ปุ่มเสร็จก่อน ไม่อย่างนั้นการคลิกจะยังไม่มีผล
const waitForHydration = () =>
  cy.get('button[aria-label="Toggle dark mode"]').should(($button) => {
    expect(Object.keys($button[0]).some((key) => key.startsWith("__reactProps"))).to.equal(true);
  });

describe("Bio page", () => {
  beforeEach(() => {
    cy.visit("/en");
    waitForHydration();
  });

  it("shows the profile and status", () => {
    cy.contains("h1", "Sawarut Songmueang");
    cy.contains("QA Engineer & Software Developer");
    cy.contains("Open to full-time roles in 2027");
  });

  it("links to every social account", () => {
    cy.contains("a", "GitHub").should("have.attr", "href", "https://github.com/SleeppyX");
    cy.contains("a", "Gmail").should("have.attr", "href", "mailto:sawarutreal@gmail.com");
    cy.contains("a", "Instagram")
      .should("have.attr", "href")
      .and("include", "instagram.com/mmsf_05");
    cy.contains("a", "Facebook").should("have.attr", "href").and("include", "facebook.com/");
  });

  it("copies the Discord username", () => {
    cy.contains("button", "Discord").click();
    cy.contains("button", "Discord").should("contain", "Copied!");
  });

  it("switches to Thai", () => {
    cy.get('[role="group"]').contains("button", "TH").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/th");
    cy.contains("พร้อมร่วมงานประจำ ปี 2027");
  });

  it("toggles between dark and light themes", () => {
    cy.get("html").should("have.class", "dark");
    cy.get('button[aria-label="Toggle dark mode"]').click();
    cy.get("html").should("not.have.class", "dark");
  });
});
