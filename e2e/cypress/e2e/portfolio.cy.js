// หน้า Portfolio: เมนู, Test Runner ใน Hero, ผลงาน, การ์ดเซนเซอร์ และ popup วิดีโอเทสต์
import { waitForHydration } from "./helpers";

describe("Portfolio page", () => {
  beforeEach(() => {
    cy.visit("/en/portfolio");
    waitForHydration();
  });

  it("links to every section from the menu", () => {
    // header มี nav 2 ชุด (จอใหญ่/มือถือ) ใช้ชุดแรก
    cy.get("header nav")
      .first()
      .find("a")
      .then(($links) => [...$links].map((link) => link.innerText.trim()))
      .should("deep.equal", [
        "About",
        "Skills",
        "Testing",
        "Lab",
        "Experience",
        "Projects",
        "Contact",
      ]);
  });

  it("runs the hero test runner to passing", () => {
    cy.get(".test-runner", { timeout: 10000 }).should("contain", "4 passing");
  });

  it("lists every project", () => {
    cy.get("#projects a[href^='/en/projects/']").should("have.length", 5);
  });

  it("shows the live sensor node", () => {
    // section ค่อยๆ แสดงตอนเลื่อนมาถึง จึงต้องเลื่อนไปก่อน
    cy.get("#lab").scrollIntoView();
    cy.get("#lab", { timeout: 10000 }).should("contain", "node-bkk-01");
  });

  it("opens the test video popup", () => {
    cy.get("#testing").scrollIntoView();
    cy.get("#testing").contains("button", "Watch").click();
    cy.get("dialog[open] video").should("have.attr", "src", "/videos/cypress.mp4");
    cy.get('dialog[open] button[aria-label="Close"]').click();
    cy.get("dialog[open]").should("not.exist");
  });

  it("has a working email link", () => {
    cy.get("#contact a[href^='mailto:']").should(
      "have.attr",
      "href",
      "mailto:sawarutreal@gmail.com",
    );
  });
});
