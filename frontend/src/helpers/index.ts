export const getDecisionFromEvent = (event: KeyboardEvent) => {
  if (event.shiftKey && event.code === 'Enter') {
    return 'escalate';
  } else if (event.code === 'Space') {
    return 'approve';
  } else if ((event.code === 'Delete' || event.code === 'Backspace' || event.code === 'Del') && !event.shiftKey) {
    return 'decline';
  } else {
    return null;
  }
}