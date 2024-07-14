import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './reason-modal.css';

const ReasonModal = forwardRef((props: { onClose: (value: string) => void}, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState('');
  const [required, setRequired] = useState(false);
  const [valid, setValid] = useState(true);

  useImperativeHandle(ref, () => ({
    showModal(valueToSet: string, required = false) {
      setValue(valueToSet);
      setIsVisible(true);
      setRequired(required);

      if(required) {
        setValid(valueToSet.length > 0);
      }
    },
    hideModal() {
      setIsVisible(false);
    },
    get isVisible() {
      return isVisible;
    }
  }));

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.stopPropagation();
    setValue(event.target.value);

    if (required) {
      setValid(event.target.value.length > 0);
    }
  };

  return (
    isVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Укажите примечание/комментарий</h3>
          <textarea
            name="reason" id="reason" value={value} onChange={handleChange} />
          {required ? <p className="required">Поле обязательно для заполнения</p> : <p>Опционально</p>}
          <button disabled={!valid} onClick={() => { props.onClose(value); setIsVisible(false) }}>Ок</button>
        </div>
      </div>
    )
  );
});

export default ReasonModal;
