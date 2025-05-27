describe('Profile page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/profile');
  });

  it('should redirect to login when not authenticated', () => {
    cy.url().should('include', '/login');
  });

  it('should display profile menu', () => {
    // First login
    cy.visit('http://localhost:4000/login');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('password');
    cy.contains('Войти').click();

    // Then check profile
    cy.visit('http://localhost:4000/profile');
    cy.contains('Профиль').should('be.visible');
    cy.contains('История заказов').should('be.visible');
    cy.contains('Выход').should('be.visible');
  });
});