class Api {
    constructor(options) {
      this._url = options.url;
      this._headers = options.headers;
    };
    _checkResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Ошибка: ${res.status}`);
    };
    getUserInfo() {
        return fetch(this._url + '/users/me', {
            method: 'GET',
            headers: this._headers
        })
        .then(this._checkResponse);
    };
    getInitialCards() {
        return fetch(this._url + '/cards', {
            method: 'GET',
            headers: this._headers
        })
        .then(this._checkResponse);
    };
    editUserInfo(userData) {
        return fetch(this._url + '/users/me', {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                name: userData.name,
                about: userData.about
            })
        })
        .then(this._checkResponse);
    };
    editUserAvatar(userData) {
        return fetch(this._url + '/users/me/avatar', {
            method: 'PATCH',
            headers: this._headers,
            body: JSON.stringify({
                avatar: userData.avatar
            })
        })
        .then(this._checkResponse);
    };
    addNewCard(data) {
        return fetch(this._url + '/cards', {
            method: 'POST',
            headers: this._headers,
            body: JSON.stringify({
                name: data.name,
                link: data.link,
                cardId: data._id
            })
        })
        .then(this._checkResponse);
    };
    deleteCard(cardId) {
        return fetch (this._url + `/cards/${cardId}`, {
            method: 'DELETE',
            headers: this._headers
        })
        .then(this._checkResponse);
    };
    changeLikeCardStatus(cardId, isLiked) {
        return fetch (this._url + `/cards/${cardId}/likes`, {
            method: `${isLiked ? 'PUT' : 'DELETE'}`,
            headers: this._headers
        })
        .then(this._checkResponse);
    };
    getData() {
        return Promise.all([this.getInitialCards(), this.getUserInfo()]);
    };
  };
  
const api = new Api ({
    url: 'https://mesto.nomoreparties.co/v1/cohort-62',
    headers: {
      authorization: 'f222d885-e074-4ace-9dec-53e306a04a75',
      'Content-Type': 'application/json'
    }
});

export default api;
