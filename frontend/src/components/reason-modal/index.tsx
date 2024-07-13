import React, { useState, forwardRef, useImperativeHandle } from 'react';
import './reason-modal.css';

const ReasonModal = forwardRef((props: { onClose: (value: string) => void }, ref) => {
  const [isVisible, setIsVisible] = useState(false);
  const [value, setValue] = useState('');

  useImperativeHandle(ref, () => ({
    showModal(valueToSet: string) {
      setValue(valueToSet);
      setIsVisible(true);
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
  };

  return (
    isVisible && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Укажите причину/детали/описание</h3>
          <textarea
            name="reason" id="reason" value={value} onChange={handleChange} />
          <button onClick={() => { props.onClose(value); setIsVisible(false) }}>Ок</button>
        </div>
      </div>
    )
  );
});

export default ReasonModal;
