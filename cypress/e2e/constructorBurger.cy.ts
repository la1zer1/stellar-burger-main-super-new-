import Cypress from 'cypress';

// Constants
const TEST_CONFIG = {
  baseUrl: 'https://norma.nomoreparties.space/api',
  viewport: { width: 1440, height: 800 },
  selectors: {
    bun: '643d69a5c3f7b9001cfa093c',
    anotherBun: '643d69a5c3f7b9001cfa093d',
    filling: '643d69a5c3f7b9001cfa0941',
    orderButton: '[data-cy="order-button"]',
    modal: '#modals',
    overlay: '[data-cy="overlay"]'
  }
};

// Helper functions
const getIngredientSelector = (id: string) => `[data-cy=${id}]`;

const setupApiMocks = () => {
  cy.intercept('GET', `${TEST_CONFIG.baseUrl}/ingredients`, { fixture: 'ingredients.json' });
  cy.intercept('POST', `${TEST_CONFIG.baseUrl}/auth/login`, { fixture: 'user.json' });
  cy.intercept('GET', `${TEST_CONFIG.baseUrl}/auth/user`, { fixture: 'user.json' });
  cy.intercept('POST', `${TEST_CONFIG.baseUrl}/orders`, { fixture: 'orderResponse.json' });
};

const setupAuthState = () => {
  window.localStorage.setItem('refreshToken', 'ipsum');
  cy.setCookie('accessToken', 'lorem');
  cy.getAllLocalStorage().should('be.not.empty');
  cy.getCookie('accessToken').should('be.not.empty');
};

const clearAuthState = () => {
  window.localStorage.clear();
  cy.clearAllCookies();
  cy.getAllLocalStorage().should('be.empty');
  cy.getAllCookies().should('be.empty');
};

// Common setup
beforeEach(() => {
  setupApiMocks();
  cy.visit('/');
  cy.viewport(TEST_CONFIG.viewport.width, TEST_CONFIG.viewport.height);
  cy.get(TEST_CONFIG.selectors.modal).as('modal');
});

describe('Конструктор бургера', () => {
  describe('Работа с ингредиентами', () => {
    it('должен увеличивать счетчик при добавлении ингредиента', () => {
      cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('button').click();
      cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).find('.counter__num').contains('1');
    });

    describe('Добавление компонентов', () => {
      it('должен добавлять булку и начинку в указанном порядке', () => {
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.bun)).children('button').click();
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('button').click();
      });

      it('должен добавлять булку после добавления начинки', () => {
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('button').click();
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.bun)).children('button').click();
      });
    });

    describe('Замена булок', () => {
      it('должен заменять булку при пустом списке начинок', () => {
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.bun)).children('button').click();
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.anotherBun)).children('button').click();
      });

      it('должен заменять булку при наличии начинок', () => {
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.bun)).children('button').click();
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('button').click();
        cy.get(getIngredientSelector(TEST_CONFIG.selectors.anotherBun)).children('button').click();
      });
    });
  });

  describe('Оформление заказа', () => {
    beforeEach(setupAuthState);
    afterEach(clearAuthState);

    it('должен успешно оформлять заказ и показывать номер', () => {
      cy.get(getIngredientSelector(TEST_CONFIG.selectors.bun)).children('button').click();
      cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('button').click();
      cy.get(TEST_CONFIG.selectors.orderButton).click();
      cy.get('@modal').find('h2').contains('38483');
    });
  });

  describe('Модальные окна', () => {
    const openIngredientModal = () => {
      cy.get('@modal').should('be.empty');
      cy.get(getIngredientSelector(TEST_CONFIG.selectors.filling)).children('a').click();
      cy.get('@modal').should('be.not.empty');
    };

    it('должен открывать модальное окно с информацией об ингредиенте', () => {
      openIngredientModal();
      cy.url().should('include', TEST_CONFIG.selectors.filling);
    });

    it('должен закрывать модальное окно при клике на крестик', () => {
      openIngredientModal();
      cy.get('@modal').find('button').click();
      cy.get('@modal').should('be.empty');
    });

    it('должен закрывать модальное окно при клике на оверлей', () => {
      openIngredientModal();
      cy.get(TEST_CONFIG.selectors.overlay).click({ force: true });
      cy.get('@modal').should('be.empty');
    });

    it('должен закрывать модальное окно при нажатии Escape', () => {
      openIngredientModal();
      cy.get('body').trigger('keydown', { key: 'Escape' });
      cy.get('@modal').should('be.empty');
    });
  });
});
