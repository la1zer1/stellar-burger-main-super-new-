describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000/login');
  });

  it('should display login form', () => {
    cy.contains('Вход').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should navigate to registration page', () => {
    cy.contains('Зарегистрироваться').click();
    cy.url().should('include', '/register');
    cy.contains('Регистрация').should('be.visible');
  });

  it('should navigate to forgot password page', () => {
    cy.contains('Восстановить пароль').click();
    cy.url().should('include', '/forgot-password');
    cy.contains('Восстановление пароля').should('be.visible');
  });
});