export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div id="modal-container" style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeButton}>&times;</button>
        <div style={{ marginTop: '10px' }}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: '#fff',
    padding: '25px',
    borderRadius: '16px',
    width: '750px',
    maxWidth: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 8px rgba(168, 159, 159, 0.2)',
    position: 'relative',
    boxSizing: 'border-box'
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#555'
  }
};