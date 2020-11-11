import uuid from 'uuid';

const useSpinner = async func => {
  let result;
  const id = uuid.v4();
  window.dispatchEvent(new CustomEvent("spinnerstart", { detail: { id } }));
  try {
    result = await func();
  } catch (error) {
    window.dispatchEvent(new CustomEvent("spinnerstop", { detail: { id } }));
    throw error;
  }
  window.dispatchEvent(new CustomEvent("spinnerstop", { detail: { id } }));

  return result;
};

export default useSpinner;
