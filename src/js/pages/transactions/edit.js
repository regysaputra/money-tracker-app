import Transactions from '../../network/transactions';

const Edit = {
  async init () {
    this._initialUI();
    await this._initialData();
    this._initialListener();
  },

  async _initialUI () {
    const listInputRadioTransactionType = [
      {
        inputId: 'recordType1',
        value: 'income',
        caption: 'Pemasukan',
        required: true,
      },
      {
        inputId: 'recordType2',
        value: 'expense',
        caption: 'Pengeluaran',
        required: true,
      },
    ];
    const inputRadioTransactionTypeEdit = document.querySelector('#inputRadioTransactionTypeEdit');
    inputRadioTransactionTypeEdit.setAttribute(
      'listRadio',
      JSON.stringify(listInputRadioTransactionType),
    );
  },

  async _initialData () {
    const transactionId = this._getTransactionId();

    if (!transactionId) {
      alert('Data dengan id yang dicari tidak ditemukan');
      return;
    }

    try {
      const response = await Transactions.getById(transactionId);
      // console.log('response : ', response)
      this._populateTransactionToForm(response);
    } catch (error) {
      console.error(error);
    }
  },

  _initialListener () {
    const editRecordForm = document.querySelector('#editRecordForm');
    editRecordForm.addEventListener(
      'submit',
      (event) => {
        event.preventDefault();
        event.stopPropagation();


        editRecordForm.classList.add('was-validated');
        this._sendPost();
      },
      false,
    );
  },

  async _sendPost () {
    const formData = this._getFormData();

    if (this._validateFormData({ ...formData })) {
      console.log('formData');
      console.log(formData);

      try {
        if (formData.evidence) {
          console.log('formData evidence : ', formData.evidence)
          // Delete old evidence
          const oldEvidence = formData.evidence
          Transactions.destroyEvidence(oldEvidence);
          const storageResponse = await Transactions.storeEvidence(formData.evidence);
          formData.evidence = storageResponse.metadata.fullPath;
        }
        const response = await Transactions.update({
          ...formData,
          id: this._getTransactionId(),
        });

        window.alert(`Transaction with id ${this._getTransactionId()} has been edited`);
        this._goToDashboardPage();
      } catch (error) {
        console.error(error);
      }
    }
  },


  _getFormData () {
    const nameInput = document.querySelector('#validationCustomRecordName');
    const amountInput = document.querySelector('#validationCustomAmount');
    const dateInput = document.querySelector('#validationCustomDate');
    const evidenceInput = document.querySelector('#validationCustomEvidence');
    const descriptionInput = document.querySelector('#validationCustomNotes');
    const typeInput = document.querySelector('input[name="recordType"]:checked');
    // console.log('Evidence Input : ', evidenceInput.files[0])
    // console.log('Description Input : ', descriptionInput.value)
    return {
      name: nameInput.value,
      amount: Number(amountInput.value),
      date: new Date(dateInput.value),
      evidence: evidenceInput.files[0],
      description: descriptionInput.value,
      type: typeInput.value,
    };
  },

  _toIsoDate (sec) {
    const dateTime = new Date(sec * 1000)
    let date = dateTime.getDate().toString()
    let month = (dateTime.getMonth()+1).toString()
    const year = dateTime.getFullYear().toString()
    let hour = dateTime.getHours().toString()
    // console.log('hour : ', hour)
    let minute = dateTime.getMinutes().toString()
    // console.log('minute : ', minute)
    date.length === 1 && (date = '0' + date)
    month.length === 1 && (month = '0' + month)
    hour.length === 1 && (hour = '0' + hour)
    minute.length === 1 && (minute = '0' + minute)
    const isoDateTime = `${year}-${month}-${date}T${hour}:${minute}`
    // console.log('isoDateTime : ', isoDateTime)
    return isoDateTime
  },

  _populateTransactionToForm (transactionRecord = null) {
    if (!(typeof transactionRecord === 'object')) {
      throw new Error(`Parameter transactionRecord should be an object. The value is ${transactionRecord}`);
    }

    const nameInput = document.querySelector('#validationCustomRecordName');
    const amountInput = document.querySelector('#validationCustomAmount');
    const dateInput = document.querySelector('#validationCustomDate');
    const inputImagePreviewEdit = document.querySelector('#inputImagePreviewEdit');
    const descriptionInput = document.querySelector('#validationCustomNotes');
    const types = document.querySelectorAll('input[name="recordType"]');
    const inputRadioTransactionTypeEdit = document.querySelector('#inputRadioTransactionTypeEdit');
    // console.log('Transaction Record : ', transactionRecord.date.seconds)
    nameInput.value = transactionRecord.name;
    amountInput.value = transactionRecord.amount;
    // const isoString = new Date(transactionRecord.date.seconds * 1000).toISOString().concat(' UTC').slice(0, 16)
    // console.log('isoString : ', isoString)
    dateInput.value = this._toIsoDate(transactionRecord.date.seconds)
    Transactions.getEvidenceURL(transactionRecord.evidence)
      .then((url) => {
        // console.log('URL : ', url)
        inputImagePreviewEdit.setAttribute('defaultImage', url);
        inputImagePreviewEdit.setAttribute('defaultImageAlt', transactionRecord.name);
      })
      .catch((error) => {
        console.error(error);
      });
    inputImagePreviewEdit.setAttribute('defaultImage', transactionRecord.evidenceUrl);
    inputImagePreviewEdit.setAttribute('defaultImageAlt', transactionRecord.name);
    descriptionInput.value = transactionRecord.description;

    const listInputRadioTransactionType = JSON.parse(
      inputRadioTransactionTypeEdit.getAttribute('listRadio'),
    );
    listInputRadioTransactionType.forEach((item) => {
      item.checked = item.value === transactionRecord.type;
    });
    inputRadioTransactionTypeEdit.setAttribute(
      'listRadio',
      JSON.stringify(listInputRadioTransactionType),
    );
  },

  _validateFormData (formData) {
    delete formData.evidence;
    const formDataFiltered = Object.values(formData).filter((item) => item === '');


    return formDataFiltered.length === 0;
  },


  _getTransactionId () {
    const searchParamEdit = new URLSearchParams(window.location.search);
    return searchParamEdit.has('id') ? searchParamEdit.get('id') : null;
  },


  _goToDashboardPage () {
    window.location.href = '/';
  },
};


export default Edit;