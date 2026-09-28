/** Turns the rejected value from services/api.js into a single human-readable string. */
export function errorMessage(err) {
  if (!err) return 'Something went wrong';
  if (Array.isArray(err.errors) && err.errors.length) {
    return err.errors.map((e) => e.message).join(' · ');
  }
  return err.message || 'Something went wrong';
}
