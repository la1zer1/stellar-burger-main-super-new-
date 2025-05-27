describe('Constructor page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  it('should display the constructor page title', () => {
    cy.contains('Соберите бургер').should('be.visible');
  });

  it('should display ingredient categories', () => {
    cy.contains('Булки').should('be.visible');
    cy.contains('Начинки').should('be.visible');
    cy.contains('Соусы').should('be.visible');
  });

  it('should switch between ingredient tabs', () => {
    cy.contains('Начинки').click();
    cy.contains('Соусы').click();
    cy.contains('Булки').click();
  });
});