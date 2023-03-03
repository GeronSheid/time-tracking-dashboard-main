async function getDashboardData(url = "/data.json") {
  const response = await fetch(url);
  const data = await response.json();

  return data;
}

class DashboardItem {

  static PERIODS = {
    daily: 'day',
    weekly: 'week',
    monthly: 'month' 
  }

  constructor(data, container = ".dashboard__content", view = "weekly") {
    this.data = data;
    this.container = document.querySelector(container);
    this.view = view;

    this.createTemplate();
  }

  createTemplate() {
    const {title, timeframes} = this.data;

    const id = title.toLowerCase().replace(/ /g, '-');
    const {current, previous} = timeframes[this.view.toLowerCase()];

    this.container.insertAdjacentHTML('beforeend', `
        <article class="activity-card activity-card--${id}">
          <div class="activity-card__wrap">
            <div class="activity-card__header">
              <h4 class="activity-card__heading">${title}</h4>
              <svg class="activtity-card__dots" width="21" height="5" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z"
                  fill="#BBC0FF"
                  fill-rule="evenodd"
                />
              </svg>
            </div>
            <div class="activity-card__content">
              <b class="activity-card__time">
                ${current}hrs
              </b>
              <div class="activity-card__total-time">
                Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs
              </div>
            </div>
          </div>
        </article>
    `);

    this.time = this.container.querySelector(`.activity-card--${id} .activity-card__time`);
    this.prev = this.container.querySelector(`.activity-card--${id} .activity-card__total-time`);
  }

  changeView(view) {
    this.view = view.toLowerCase();
    const {current, previous} = this.data.timeframes[this.view.toLowerCase()];

    this.time.innerText = `${current}hrs`
    this.prev.innerText = `Last ${DashboardItem.PERIODS[this.view]} - ${previous}hrs`
  }
}

document.addEventListener('DOMContentLoaded', () => {
  getDashboardData()
    .then(data => {
      const cards = data.map(card => new DashboardItem(card));

      const menuItems = document.querySelectorAll('.dashboard__menu-item');
      menuItems.forEach(selector => {
        selector.addEventListener('click', function() {
          menuItems.forEach(e => e.classList.remove('dashboard__menu-item--active'))
          selector.classList.add('dashboard__menu-item--active');

          const currentView = selector.innerText.trim().toLowerCase();
          cards.forEach(card => card.changeView(currentView));
        })
      })
    })
})

