export const useRWApi = async (path, opts) => {
  const auth = useAuth();
  const Authorization = auth.data.value ? 'Bearer ' + auth.data.value.access_token : undefined;
  const Locations = auth.data.value ? auth.data.value.location_ids : undefined;

  const res = await $fetch('/api' + path, {
    ...opts,
    headers: {
      ...(opts.headers || {}),
      Authorization,
      Locations,
    },
  });

  try {
    if (opts.method?.toLowerCase() !== 'get') {
      await auth.getSession();
    }
  } catch {}

  return res;

};