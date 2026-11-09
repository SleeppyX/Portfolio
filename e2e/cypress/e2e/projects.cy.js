// หน้ารายละเอียดผลงาน (EN/TH) และหน้า 404
const SLUGS = [
  "portfolio-site",
  "ml-pipeline-generator",
  "e-cmis",
  "rsa-3d-encryption",
  "tuty-shop",
];

describe("Project pages", () => {
  it("opens every project page", () => {
    SLUGS.forEach((slug) => {
      cy.visit(`/en/projects/${slug}`);
      cy.get("article h1").should("be.visible");
      cy.contains("a", "Back to projects");
    });
  });

  it("translates project pages to Thai", () => {
    cy.visit("/th/projects/tuty-shop");
    cy.contains("เครื่องใช้ไฟฟ้าคลายร้อน");
  });

  it("goes back to the projects section", () => {
    cy.visit("/en/projects/e-cmis");
    cy.contains("a", "Back to projects").click();
    cy.location("pathname", { timeout: 10000 }).should("eq", "/en/portfolio");
    cy.location("hash").should("eq", "#projects");
  });

  it("shows a 404 page for unknown projects", () => {
    cy.visit("/en/projects/does-not-exist", { failOnStatusCode: false });
    cy.contains("Page not found");
  });
});
