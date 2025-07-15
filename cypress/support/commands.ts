/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import type { Prijava } from "@prisma/client";
import nivojiIzkusenosti from "../../utils/izkusenosti";

// Use ES module augmentation for Cypress types
export {};

Cypress.Commands.add("chooseDate", (date: Date) => {
  cy.get("[data-cy='datumRojstva']").click();

  const monthYear = date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const dateString = date.toISOString().split("T")[0];

  function goBackUntilMonthYear() {
    cy.get("div[role='application'] > div")
      .invoke("text")
      .then((text) => {
        if (text.includes(monthYear)) {
          return;
        }
        cy.get("div[role='application'] > div > button[aria-label='Previous month']").click();
        goBackUntilMonthYear();
      });
  }
  goBackUntilMonthYear();

  cy.get("div[role='application'] > div > table").find(`div[data-value='${dateString}']`).click();
});

Cypress.Commands.add("chooseSelect", (field: string, value: string) => {
  cy.get(`[data-cy='${field}']`).click();
  cy.get(`div[role="listbox"] > div > div > div`).contains(value).click();
});

Cypress.Commands.add("prijavaVmesnik", (prijava: Partial<Prijava>, pricakovanUspeh: boolean) => {
  cy.visit("/prijava");

  cy.get("[data-cy='prijaviSe']").should("be.disabled");

  if (prijava.imePriimek) cy.get("[data-cy='imePriimek']").type(prijava.imePriimek);

  if (prijava.email) cy.get("[data-cy='email']").type(prijava.email);

  if (prijava.telefon) cy.get("[data-cy='telefon']").type(prijava.telefon);

  if (prijava.datumRojstva) cy.chooseDate(prijava.datumRojstva);

  if (prijava.izkusenost)
    cy.chooseSelect(
      "izkusenost",
      nivojiIzkusenosti.find((nivo) => nivo.value === prijava.izkusenost)?.label
    );

  if (prijava.proizvajalciLoparjev)
    cy.get("[data-cy='proizvajalciLoparjev']").type(prijava.proizvajalciLoparjev.join(","));

  if (prijava.dodatno) {
    cy.get("[data-cy='dodatno'] > div").should("have.length", 0);
    for (const dodaten of Object.keys(prijava.dodatno)) {
      cy.get("[data-cy='dodajDodatno']").click();
      cy.get("[data-cy='novoDodatno']").type(dodaten).type("{enter}");
      cy.get("[data-cy='dodatno'] > div")
        .last()
        .find("input[type='text']")
        .type(prijava.dodatno[dodaten]);
    }
  }

  if (prijava.objavaSlik) cy.get("[data-cy='objavaSlik']").click();

  if (prijava.obdelavaPodatkov) cy.get("[data-cy='obdelavaPodatkov']").click();

  if (!pricakovanUspeh) cy.get("[data-cy='prijaviSe']").should("be.disabled");
  else {
    cy.get("[data-cy='prijaviSe']").should("not.be.disabled");

    cy.intercept("POST", "/api/prijava").as("prijava");

    cy.get("[data-cy='prijaviSe']").click();

    cy.wait("@prijava").then((response) => {
      expect(response.response?.statusCode).to.eq(200);
    });

    cy.get("[data-cy='napaka']").should("not.exist");
    cy.get("[data-cy='uspesnaPrijava']").should("be.visible");
  }
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      chooseDate(date: Date): Chainable<void>;
      chooseSelect(field: string, value: string): Chainable<void>;
      prijavaVmesnik(prijava: Partial<Prijava>, pricakovanUspeh: boolean): Chainable<void>;
    }
  }
}
