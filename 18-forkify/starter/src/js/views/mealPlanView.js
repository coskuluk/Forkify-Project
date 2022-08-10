import View from './View';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView';

//burada amacımız kullanıcıların dilerlerse ilgili tarifi haftalık meal planlarına dahil etmeleridir.

class MealPlanView extends View {
  _parentElement = document.querySelector('.week__plans-list');
  _errorMessage =
    'No recipe added to you weekly plan yet! Find a nice recipe and add it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    return this._data.map(plan => previewView.render(plan, false)).join('');
  }
}

export default new MealPlanView();
