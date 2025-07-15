import type { Prijava } from "@prisma/client";

describe("med-končni test", () => {
  it("seznam prijav se naloži v začetnem stanju", () => {
    cy.visit("/");
    cy.get("h2").contains("Prijave");
    cy.get("table > tbody > tr").should("have.length", 2);
  });

  it("prijavni obrazec se naloži v začetnem stanju", () => {
    cy.visit("/prijava");
    cy.get("h2").contains("Prijava");

    cy.get("[data-cy='imePriimek']").should("have.value", "");
    cy.get("[data-cy='email']").should("have.value", "");
    cy.get("[data-cy='telefon']").should("have.value", "");
    cy.get("[data-cy='datumRojstva']").should("contain", "Izberi datum");
    cy.get("[data-cy='izkusenost']").should("contain", "Izberi nivo izkušenosti");
    cy.get("[data-cy='proizvajalciLoparjev']").should("have.value", "");
    cy.get("[data-cy='dodatno'] > div").should("have.length", 0);
    cy.get("[data-cy='objavaSlik']").should("not.be.checked");
    cy.get("[data-cy='obdelavaPodatkov']").should("not.be.checked");
    cy.get("[data-cy='napaka']").should("not.exist");
    cy.get("[data-cy='prijaviSe']").should("be.disabled");
  });

  const pravilnaPrijava: Partial<Prijava> = {
    imePriimek: "Marija Novak",
    email: "marija.novak@gmail.com",
    telefon: "041 123 459",
    datumRojstva: new Date("2024-09-20"),
    izkusenost: "TEKMOVALEC",
    proizvajalciLoparjev: ["Yonex", "Babolat"],
    objavaSlik: true,
    obdelavaPodatkov: true,
    dodatno: {
      "Najljubši igralec": "Viktor Axelsen",
      "Najljubši trener": "Jakob Høgh",
      "Trenutni lopar": "Yonex Astrox 99",
    },
  };

  it("pravilna prijava", () => {
    cy.prijavaVmesnik(pravilnaPrijava, true);

    cy.visit("/");
    cy.get("table > tbody > tr").should("have.length", 3);
  });

  it("nepravilna prijava - prazna", () => {
    cy.prijavaVmesnik({}, false);
  });

  it("nepravilna prijava - nepravilen email", () => {
    cy.prijavaVmesnik({ ...pravilnaPrijava, email: "marija.novakgmail.com" }, false);
  });

  it("nepravilna prijava - nepravilen telefon", () => {
    cy.prijavaVmesnik({ ...pravilnaPrijava, telefon: "abc123" }, false);
  });

  it("prazna prijava - API", () => {
    cy.request({
      method: "POST",
      url: "/api/prijava",
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });

  it("nepravilna prijava - API", () => {
    cy.request({
      method: "POST",
      url: "/api/prijava",
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
